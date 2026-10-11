import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import type { ActionConfig, HomeAssistant, LabelEntry, ScenePulseCardConfig, SceneConfig } from "./types";
import {
  asList,
  buildRows,
  currentMode,
  discoverModeEntity,
  displayName,
  groupRows,
  menuFor,
  modeLabelIds,
  recapture,
  selectScenes,
  stubEntities,
  targetLines,
  undoSnapshot,
  watched,
  UNDO_ENTITY,
  type Group,
  type MenuKey,
  type Row,
} from "./scenes";
import { actionHandler, type ActionKind } from "./action-handler";
import { localize, relativeTime } from "./localize";
import { errorMessage, toast } from "./ha";
import { cardStyles } from "./styles";
import { ScenePulseCardEditor } from "./editor";


/** How long a run may take before the icon stops breathing anyway. */
const RUNNING_MS = 8000;
/** How long the check mark stays after a run. */
const DONE_MS = 1600;
/** How long the Undo toast stays. */
const UNDO_TOAST_MS = 10_000;
/** After a confirmed run (through HA's dialog), how long we watch for the scene to run before giving up. */
const CONFIRM_WATCH_MS = 60_000;

const DOMAIN_ICONS: Record<string, string> = {
  light: "mdi:lightbulb-outline",
  switch: "mdi:toggle-switch-outline",
  cover: "mdi:blinds",
  climate: "mdi:thermostat",
  fan: "mdi:fan",
  media_player: "mdi:speaker",
  input_boolean: "mdi:toggle-switch-outline",
  input_select: "mdi:format-list-bulleted",
  select: "mdi:format-list-bulleted",
  number: "mdi:ray-vertex",
  input_number: "mdi:ray-vertex",
  lock: "mdi:lock-outline",
  vacuum: "mdi:robot-vacuum",
  humidifier: "mdi:air-humidifier",
};

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

export class ScenePulseCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: ScenePulseCardConfig;
  /** Stored scene configs by config id (admins only), for "Active now", "What it sets" and "Update from now". */
  @state() private _configs = new Map<string, SceneConfig>();
  @state() private _labelNames: Record<string, string> = {};
  @state() private _menu?: string;
  @state() private _menuView: "main" | "show" = "main";
  /** "Update from now" was tapped once and waits for the second tap. */
  @state() private _sure = false;

  private _ids: string[] = [];
  private _deps: unknown[] = [];
  private _watched = new Set<string>();
  private _modeEntity?: string;
  /** Scenes we just ran: the scene's last-run time before the run, so we know when it answered. */
  private _running = new Map<string, { before?: string; timer: number }>();
  private _done = new Map<string, number>();
  /** Scenes run through HA's confirmation dialog: the toast waits until the scene really ran. */
  private _awaiting = new Map<string, { before?: string; undo: boolean; timer: number }>();
  /** The scene last run from this card whose "before" is held in the undo scene. */
  private _undoFor?: string;
  private _configKeys = new Map<string, string>();
  private _labelsLoaded = false;
  private _ticker?: number;

  // ---- Lovelace API -------------------------------------------------------

  static getConfigElement() {
    return document.createElement("scene-pulse-card-editor");
  }

  static getStubConfig(hass?: HomeAssistant): Partial<ScenePulseCardConfig> {
    const entities = stubEntities(hass);
    return entities.length ? { entities } : {};
  }

  setConfig(config: ScenePulseCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    for (const key of ["entities", "exclude", "confirm"] as const) {
      const v = config[key];
      if (v !== undefined && (!Array.isArray(v) || v.some((x) => typeof x !== "string"))) {
        throw new Error(`\`${key}\` must be a list of scene entity ids`);
      }
    }
    if (config.label !== undefined && asList(config.label).some((x) => typeof x !== "string")) {
      throw new Error("`label` must be a label id or a list of them");
    }
    if (config.group_by !== undefined && !["none", "area", "label"].includes(config.group_by)) {
      throw new Error("`group_by` must be none, area or label");
    }
    if (config.transition !== undefined && (typeof config.transition !== "number" || config.transition < 0 || config.transition > 300)) {
      throw new Error("`transition` must be a number of seconds between 0 and 300");
    }
    if (config.mode_entity !== undefined && typeof config.mode_entity !== "string") {
      throw new Error("`mode_entity` must be an input_select or select entity id, or none");
    }
    if (config.undo !== undefined && typeof config.undo !== "boolean") throw new Error("`undo` must be true or false");
    this._config = { ...config };
    this._deps = [];
  }

  getCardSize(): number {
    return 1 + Math.max(1, this._ids.length);
  }

  getGridOptions() {
    return { columns: 6, min_columns: 4, rows: "auto" as const };
  }

  // ---- Lifecycle ----------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    // "3 hours ago" changes with time, not with states.
    this._ticker = window.setInterval(() => this.requestUpdate(), 60_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._ticker) window.clearInterval(this._ticker);
    for (const r of this._running.values()) window.clearTimeout(r.timer);
    for (const t of this._done.values()) window.clearTimeout(t);
    for (const a of this._awaiting.values()) window.clearTimeout(a.timer);
    this._running.clear();
    this._done.clear();
    this._awaiting.clear();
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    const hass = this.hass;
    if (!old || !hass) return true;
    if (old.entities !== hass.entities || old.areas !== hass.areas || old.language !== hass.language || old.locale !== hass.locale) {
      return true;
    }
    if (old.states[UNDO_ENTITY] !== hass.states[UNDO_ENTITY]) return true;
    for (const id of this._watched) if (old.states[id] !== hass.states[id]) return true;
    return false;
  }

  protected willUpdate(): void {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return;
    // Selection and mode discovery scan every state: only when the registry or the config change.
    const deps = [hass.entities, config];
    if (deps.some((d, i) => d !== this._deps[i])) {
      this._deps = deps;
      this._ids = selectScenes(hass, config);
      this._modeEntity = discoverModeEntity(hass, config);
    }
    // Members come from the scenes' own states and stored configs: cheap, only the shown scenes.
    this._watched = watched(hass, this._ids, this._configs, this._modeEntity);

    // A run is over as soon as the scene's last-run time moves.
    for (const [id, r] of this._running) {
      if (hass.states[id]?.state !== r.before) {
        window.clearTimeout(r.timer);
        this._running.delete(id);
        this._markDone(id);
      }
    }
    // A confirmed run: say so (with Undo) once it really happened.
    for (const [id, a] of this._awaiting) {
      if (hass.states[id]?.state !== a.before) {
        window.clearTimeout(a.timer);
        this._awaiting.delete(id);
        this._markDone(id);
        if (a.undo) this._undoFor = id;
        this._ranToast(id, a.undo);
      }
    }
  }

  protected updated(): void {
    if (!this.hass || !this._config) return;
    this._loadConfigs();
    this._loadLabels();
  }

  private _t = (key: string, vars?: Record<string, string | number>) => localize(this.hass, key, vars);

  private get _admin(): boolean {
    return this.hass?.user?.is_admin === true;
  }

  private get _undoOn(): boolean {
    return this._config?.undo !== false;
  }

  // ---- Data from Home Assistant ------------------------------------------

  /**
   * Read the stored config of every shown scene that has one (admins only: HA's rule). Re-read when the
   * scene's state object changes (a reload, a run), so an edit in the scene editor shows up here.
   */
  private _loadConfigs() {
    if (!this._admin || !this.hass!.callApi) return;
    for (const eid of this._ids) {
      const s = this.hass!.states[eid];
      const id = s?.attributes.id ? String(s.attributes.id) : undefined;
      if (!id) continue;
      const key = s!.last_updated;
      if (this._configKeys.get(id) === key) continue;
      this._configKeys.set(id, key);
      this.hass!.callApi<SceneConfig>("GET", `config/scene/config/${encodeURIComponent(id)}`)
        .then((c) => {
          if (!c || typeof c.entities !== "object") return;
          this._configs = new Map(this._configs).set(id, c);
        })
        .catch(() => {
          /* scenes not stored in the UI files: the card falls back to "untouched since it ran" */
        });
    }
  }

  /** Label names, for the house mode match and for grouping by label. */
  private async _loadLabels() {
    if (this._labelsLoaded) return;
    if (!this._modeEntity && this._config!.group_by !== "label") return;
    this._labelsLoaded = true;
    try {
      const labels = await this.hass!.callWS<LabelEntry[]>({ type: "config/label_registry/list" });
      this._labelNames = Object.fromEntries(labels.map((l) => [l.label_id, l.name]));
    } catch {
      /* label ids still match the mode, and show as titles */
    }
  }

  // ---- Render -------------------------------------------------------------

  private _modeLabels(mode: string | undefined) {
    return modeLabelIds(mode, this._labelNames);
  }

  protected render() {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return nothing;
    const mode = currentMode(hass, this._modeEntity);
    const modeLabels = this._modeLabels(mode);
    const rows = buildRows(hass, config, this._ids, { configs: this._configs, modeLabels });
    const groups = groupRows(
      hass,
      config,
      rows,
      config.group_by ?? "none",
      {
        labelNames: this._labelNames,
        other: this._t("other"),
        rest: this._t("more_scenes"),
        modeTitle: mode ? this._t("for_mode", { mode: this._modeName(mode) }) : undefined,
      },
      modeLabels
    );
    return html`<ha-card>
      ${this._renderHeader(mode)}
      ${!rows.length
        ? html`<div class="empty">
            <ha-icon icon="mdi:palette-outline"></ha-icon>
            <span>${this._t("empty")}</span>
            <span class="hint">${this._t("empty_hint")}</span>
            ${this._admin
              ? html`<button class="chip" @click=${() => this._navigate("/config/scene/edit/new")}>
                  <ha-icon icon="mdi:plus"></ha-icon>${this._t("empty_new")}
                </button>`
              : nothing}
          </div>`
        : groups.map((g) => this._renderGroup(g))}
      ${this._renderMenu(rows)}
    </ha-card>`;
  }

  /** The mode as the selector shows it (HA translates `select` options; input_select options are plain). */
  private _modeName(mode: string): string {
    const s = this.hass!.states[this._modeEntity!];
    return s && this.hass!.formatEntityState ? this.hass!.formatEntityState(s, mode) : mode;
  }

  private _renderHeader(mode: string | undefined) {
    const title = this._config!.title ?? this._t("title");
    // "New scene" sits next to a title; a card without one stays a bare list (the empty state still offers it).
    const admin = !!title && this._admin && this._ids.length > 0;
    if (!title && !mode && !admin) return nothing;
    const name = mode ? this._modeName(mode) : "";
    return html`<div class="header">
      ${title ? html`<span class="title">${title}</span>` : nothing}
      <div class="chips">
        ${mode
          ? html`<button class="chip" title=${this._t("mode_chip", { mode: name })} aria-label=${this._t("mode_chip", { mode: name })}
              @click=${() => this._fire(this._modeEntity!, { action: "more-info" })}>
              <ha-icon icon="mdi:home-switch-outline"></ha-icon>${name}
            </button>`
          : nothing}
        ${admin
          ? html`<button class="chip icon-only" title=${this._t("new_scene")} aria-label=${this._t("new_scene")}
              @click=${() => this._navigate("/config/scene/edit/new")}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>`
          : nothing}
      </div>
    </div>`;
  }

  private _renderGroup(g: Group) {
    return html`${g.title
        ? html`<div class="section-title">
            ${g.key === "__mode" ? html`<ha-icon icon="mdi:home-switch-outline"></ha-icon>` : nothing}${g.title}
          </div>`
        : nothing}
      <div class="list">${g.rows.map((r) => this._renderRow(r))}</div>`;
  }

  private _phase(r: Row): "running" | "done" | undefined {
    if (this._running.has(r.entity_id)) return "running";
    if (this._done.has(r.entity_id)) return "done";
    return undefined;
  }

  private _icon(r: Row): string {
    const custom = this.hass!.states[r.entity_id]?.attributes.icon;
    if (this._phase(r) === "done") return "mdi:check";
    if (r.status === "unavailable") return "mdi:alert-outline";
    if (custom) return String(custom);
    return r.status === "active" ? "mdi:palette" : "mdi:palette-outline";
  }

  private _secondary(r: Row): string {
    const phase = this._phase(r);
    if (phase === "running") return this._t("running");
    if (phase === "done") return this._t("done");
    if (r.status === "unavailable") return this._t("unavailable");
    if (r.status === "active") return this._t("active");
    return r.last ? relativeTime(this.hass, r.last) : this._t("never_ran");
  }

  private _renderRow(r: Row) {
    const secondary = this._secondary(r);
    const phase = this._phase(r);
    const off = r.status === "unavailable";
    return html`<div class=${classMap({ row: true, [r.status]: true, [phase ?? "rest"]: true })} data-eid=${r.entity_id}>
      <div
        class="main"
        role="button"
        tabindex="0"
        aria-label=${`${this._t("run", { name: r.name })}, ${secondary}`}
        ${actionHandler({ hasHold: true })}
        @scp-action=${(ev: CustomEvent<{ action: ActionKind }>) =>
          ev.detail.action === "hold" ? this._openMenu(r.entity_id) : off ? this._moreInfo(r.entity_id) : this._run(r)}
      >
        <div class="disc"><ha-icon .icon=${this._icon(r)}></ha-icon></div>
        <div class="text">
          <span class="name">${r.name}</span>
          <span class="secondary">${secondary}</span>
        </div>
      </div>
      <button class="run" aria-label=${this._t("run", { name: r.name })} ?disabled=${off} @click=${() => this._run(r)}>
        <ha-icon icon="mdi:play"></ha-icon>
      </button>
      <button
        class="more"
        aria-label=${this._t("more", { name: r.name })}
        aria-haspopup="menu"
        aria-expanded=${this._menu === r.entity_id ? "true" : "false"}
        @click=${() => this._openMenu(r.entity_id)}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    </div>`;
  }

  // ---- Menu ---------------------------------------------------------------

  private _renderMenu(rows: Row[]) {
    const row = this._menu ? rows.find((r) => r.entity_id === this._menu) : undefined;
    return html`<div class="menu" popover="auto" role="menu" @toggle=${this._menuToggled}>
      ${row ? (this._menuView === "show" ? this._renderTargets(row) : this._renderMenuMain(row)) : nothing}
    </div>`;
  }

  private _renderMenuMain(row: Row) {
    const stored = row.id ? this._configs.get(row.id) : undefined;
    const keys = menuFor(row, {
      admin: this._admin,
      canUndo: this._undoOn && this._undoFor === row.entity_id && !!this.hass!.states[UNDO_ENTITY],
      hasConfig: !!stored,
    });
    const has = (k: MenuKey) => keys.includes(k);
    const item = (key: MenuKey, icon: string, label = this._t(`menu_${key}`), cls = "") =>
      html`<button class="item ${cls}" role="menuitem" @click=${() => this._menuAction(row, key)}>
        <ha-icon .icon=${icon}></ha-icon><span>${label}</span>
      </button>`;
    return html`<div class="menu-head">${row.name}</div>
      ${has("run") ? item("run", "mdi:play") : nothing}
      ${has("undo") ? item("undo", "mdi:undo-variant") : nothing}
      ${has("show") ? item("show", "mdi:format-list-checks") : nothing}
      ${has("update") || has("edit") ? html`<div class="sep"></div>` : nothing}
      ${has("update")
        ? this._sure
          ? item("update", "mdi:camera-retake-outline", this._t("menu_update_sure"), "sure")
          : item("update", "mdi:camera-retake-outline")
        : nothing}
      ${has("edit") ? item("edit", "mdi:pencil-outline") : nothing}
      ${has("more_info") ? item("more_info", "mdi:information-outline") : nothing}`;
  }

  private _renderTargets(row: Row) {
    const hass = this.hass!;
    const stored = row.id ? this._configs.get(row.id) : undefined;
    const lines = targetLines(hass, row.members, stored);
    return html`<div class="menu-head">
        <button @click=${(e: Event) => this._back(e)} aria-label=${this._t("back")}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${row.name}
        </button>
      </div>
      <div class="targets">
        ${lines.map((l) => {
          const s = hass.states[l.entity_id];
          const icon = (s?.attributes.icon as string | undefined) ?? DOMAIN_ICONS[l.entity_id.split(".")[0]] ?? "mdi:circle-small";
          const state = l.state !== undefined ? (s && hass.formatEntityState ? hass.formatEntityState(s, l.state) : l.state) : "";
          const text = [state, l.extra].filter(Boolean).join(" · ");
          return html`<div class=${classMap({ target: true, matches: !!l.matches })} title=${l.matches ? this._t("matches_now") : ""}>
            <ha-icon .icon=${icon}></ha-icon>
            <span class="t-name">${displayName(hass, l.entity_id)}</span>
            ${text ? html`<span class="t-state">${text}</span>` : nothing}
          </div>`;
        })}
      </div>
      ${stored ? nothing : html`<div class="note">${this._t("targets_unknown")}</div>`}`;
  }

  private async _back(e: Event) {
    e.stopPropagation();
    this._menuView = "main";
    await this.updateComplete;
    this._placeMenu();
  }

  private async _openMenu(eid: string) {
    if (this._menu === eid) {
      this._closeMenu();
      return;
    }
    this._menu = eid;
    this._menuView = "main";
    this._sure = false;
    await this.updateComplete;
    const menu = this.renderRoot.querySelector<HTMLElement>(".menu");
    if (!menu) return;
    try {
      if (!menu.matches(":popover-open")) menu.showPopover();
    } catch {
      menu.classList.add("open"); // browsers without popovers: a plain fixed box
    }
    this._placeMenu();
    menu.querySelector<HTMLElement>("button")?.focus();
  }

  /** Put the menu under the row's ⋯ button, or above it when there is no room below. */
  private _placeMenu() {
    const menu = this.renderRoot.querySelector<HTMLElement>(".menu");
    const anchor = this._menu
      ? this.renderRoot.querySelector<HTMLElement>(`.row[data-eid="${CSS.escape(this._menu)}"] .more`)
      : null;
    if (!menu || !anchor) return;
    const a = anchor.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const left = Math.min(Math.max(8, a.right - m.width), window.innerWidth - m.width - 8);
    let top = a.bottom + 4;
    if (top + m.height > window.innerHeight - 8) top = Math.max(8, a.top - m.height - 4);
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  private _closeMenu() {
    const menu = this.renderRoot.querySelector<HTMLElement>(".menu");
    try {
      if (menu?.matches(":popover-open")) menu.hidePopover();
    } catch {
      /* not a popover */
    }
    menu?.classList.remove("open");
    this._menu = undefined;
    this._sure = false;
  }

  private _menuToggled = (ev: Event) => {
    if ((ev as ToggleEvent).newState === "closed") {
      this._menu = undefined;
      this._sure = false;
    }
  };

  private async _menuAction(row: Row, key: MenuKey) {
    if (key === "show") {
      this._menuView = "show";
      await this.updateComplete;
      this._placeMenu();
      return;
    }
    if (key === "update" && !this._sure) {
      this._sure = true; // the second tap does it: replacing a scene can't be undone from here
      return;
    }
    this._closeMenu();
    switch (key) {
      case "run":
        return this._run(row);
      case "undo":
        return this._undo();
      case "update":
        return this._update(row);
      case "edit":
        return this._navigate(`/config/scene/edit/${encodeURIComponent(row.id ?? "")}`);
      case "more_info":
        return this._moreInfo(row.entity_id);
      default:
        return undefined;
    }
  }

  // ---- Actions ------------------------------------------------------------

  private _markDone(id: string) {
    const prev = this._done.get(id);
    if (prev) window.clearTimeout(prev);
    this._done.set(
      id,
      window.setTimeout(() => {
        this._done.delete(id);
        this.requestUpdate();
      }, DONE_MS)
    );
  }

  /** Remember how the scene's entities are now, so Undo can put them back. False when that didn't work. */
  private async _snapshot(row: Row): Promise<boolean> {
    if (!this._undoOn) return false;
    const data = undoSnapshot(row.members);
    if (!data) return false;
    try {
      await this.hass!.callService("scene", "create", data);
      return true;
    } catch {
      return false; // the run still goes ahead, only without Undo
    }
  }

  private _runData(): Record<string, unknown> {
    const t = this._config!.transition;
    return t ? { transition: t } : {};
  }

  /**
   * Run a scene. With `confirm` listed for it, HA's own confirmation dialog asks first (through
   * `hass-action`) and the toast waits until the scene really ran; otherwise the call goes straight out.
   */
  private async _run(row: Row) {
    if (row.status === "unavailable") return;
    const before = this.hass!.states[row.entity_id]?.state;
    const undo = await this._snapshot(row);
    if (row.confirm) {
      const prev = this._awaiting.get(row.entity_id);
      if (prev) window.clearTimeout(prev.timer);
      const timer = window.setTimeout(() => this._awaiting.delete(row.entity_id), CONFIRM_WATCH_MS);
      this._awaiting.set(row.entity_id, { before, undo, timer });
      this._fire(row.entity_id, {
        action: "perform-action",
        perform_action: "scene.turn_on",
        data: this._runData(),
        target: { entity_id: row.entity_id },
        confirmation: { text: this._t("confirm_run", { name: row.name }) },
      });
      return;
    }
    const prev = this._running.get(row.entity_id);
    if (prev) window.clearTimeout(prev.timer);
    const timer = window.setTimeout(() => {
      this._running.delete(row.entity_id);
      this.requestUpdate();
    }, RUNNING_MS);
    this._running.set(row.entity_id, { before, timer });
    this.requestUpdate();
    try {
      await this.hass!.callService("scene", "turn_on", this._runData(), { entity_id: row.entity_id });
      if (undo) this._undoFor = row.entity_id;
      this._ranToast(row.entity_id, undo);
    } catch (err) {
      window.clearTimeout(timer);
      this._running.delete(row.entity_id);
      this.requestUpdate();
      toast(this, this._t("error", { error: errorMessage(err) }));
    }
  }

  private _ranToast(eid: string, undo: boolean) {
    const name = displayName(this.hass!, eid);
    if (undo && this._undoFor === eid) {
      toast(this, this._t("ran", { name }), { text: this._t("undo"), action: () => this._undo() }, UNDO_TOAST_MS);
    } else {
      toast(this, this._t("ran", { name }));
    }
  }

  private async _undo() {
    if (!this.hass!.states[UNDO_ENTITY]) return;
    try {
      await this.hass!.callService("scene", "turn_on", {}, { entity_id: UNDO_ENTITY });
      this._undoFor = undefined;
      toast(this, this._t("undone"));
      this.requestUpdate();
    } catch (err) {
      toast(this, this._t("error", { error: errorMessage(err) }));
    }
  }

  /** Re-capture the scene from how its entities are right now, through HA's scene config API (admins). */
  private async _update(row: Row) {
    if (!row.id) return;
    const path = `config/scene/config/${encodeURIComponent(row.id)}`;
    try {
      const fresh = await this.hass!.callApi<SceneConfig>("GET", path);
      const next = recapture(this.hass!, fresh);
      await this.hass!.callApi("POST", path, next as unknown as Record<string, unknown>);
      this._configs = new Map(this._configs).set(row.id, next);
      toast(this, this._t("updated", { name: row.name }));
    } catch (err) {
      toast(this, this._t("error", { error: errorMessage(err) }));
    }
  }

  private _moreInfo(eid: string) {
    this._fire(eid, { action: "more-info" });
  }

  private _navigate(path: string) {
    this._fire("", { action: "navigate", navigation_path: path });
  }

  /** Hand the action to Home Assistant's own handler (confirmation, navigate, more-info, perform-action). */
  private _fire(entity: string, tap_action: ActionConfig) {
    this.dispatchEvent(
      new CustomEvent("hass-action", { bubbles: true, composed: true, detail: { config: { entity, tap_action }, action: "tap" } })
    );
  }
}

if (!customElements.get("scene-pulse-card")) {
  customElements.define("scene-pulse-card", ScenePulseCard);
  customElements.define("scene-pulse-card-editor", ScenePulseCardEditor);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "scene-pulse-card",
    name: "Scene Pulse Card",
    description: "Your scenes in a calm list: run them, undo, see which one is active, edit or re-capture them. The current house mode's scenes come first.",
    preview: true,
  });
}
