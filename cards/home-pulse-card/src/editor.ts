import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import type { HomeAssistant, HomePulseCardConfig, ModeConfig, ShortcutConfig, TodayConfig, TodayEntity } from "./types";
import { ALARM_MODES, DEFAULT_ALARM_MODES, DEFAULT_ALERT_CLASSES, DEFAULT_PULSE, DEFAULT_SECTIONS, PULSE_IDS, SECTION_IDS } from "./home";
import { localize } from "./localize";

type Schema = Record<string, unknown>;
type ListKey = "shortcuts" | "modes";

const ALERT_CLASS_OPTIONS = [...DEFAULT_ALERT_CLASSES, "vibration", "cold", "heat", "sound", "light"];

/** Values the editor treats as "not set": they are left out of the YAML. */
const DEFAULTS: Record<string, unknown> = {
  layout: "default",
  appearance: "card",
  sections: DEFAULT_SECTIONS,
  show_date: true,
  center_greeting: false,
  show_away: true,
  alarm_modes: DEFAULT_ALARM_MODES,
  pulse: DEFAULT_PULSE,
  show_inactive: false,
  nudges: true,
  battery_threshold: 20,
  columns: 4,
  show_names: true,
};

/** Make sure HA's lazily-loaded form elements exist before rendering the editor. */
async function loadHaElements(): Promise<void> {
  if (customElements.get("ha-form") && customElements.get("ha-selector")) return;
  try {
    const helpers = await (window as unknown as { loadCardHelpers?: () => Promise<any> }).loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: "entities", entities: [] });
    await card?.constructor?.getConfigElement?.();
  } catch {
    /* the card editor dialog usually has them loaded already */
  }
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as T;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export class HomePulseCardEditor extends LitElement {
  /** `overview` edits Home Pulse Card; `shortcuts` edits Home Pulse Shortcuts (its subclass below). */
  protected kind: "overview" | "shortcuts" = "overview";
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: HomePulseCardConfig;
  /** Open list items, as "shortcuts:2" / "modes:0". */
  @state() private _open = new Set<string>();
  @state() private _ready = false;

  connectedCallback(): void {
    super.connectedCallback();
    loadHaElements().then(() => (this._ready = true));
  }

  setConfig(config: HomePulseCardConfig): void {
    this._config = config;
  }

  private _t = (key: string, vars?: Record<string, string | number>) => localize(this.hass, key, vars);

  /** Defaults left out of the YAML: the shortcuts card is flat unless asked otherwise. */
  private get _defaults(): Record<string, unknown> {
    return this.kind === "shortcuts" ? { ...DEFAULTS, appearance: "flat" } : DEFAULTS;
  }

  private _hasShortcuts(): boolean {
    return !!this._config?.shortcuts?.length;
  }

  private _layoutGrid(): Schema {
    const t = this._t;
    const select = (options: { value: string; label: string }[]) => ({ select: { mode: "dropdown", options } });
    const tiles = this.kind === "shortcuts";
    return {
      type: "grid",
      name: "",
      schema: [
        {
          name: "layout",
          selector: select([
            { value: "default", label: t("ed_layout_default") },
            { value: "compact", label: t("ed_layout_compact") },
          ]),
        },
        {
          name: "appearance",
          selector: select([
            { value: "card", label: t(tiles ? "ed_appearance_one_card" : "ed_appearance_card") },
            { value: "flat", label: t(tiles ? "ed_appearance_tiles" : "ed_appearance_flat") },
          ]),
        },
      ],
    };
  }

  private _tileGrid(): Schema {
    return {
      type: "grid",
      name: "",
      schema: [
        { name: "columns", selector: { number: { min: 1, max: 8, mode: "slider" } } },
        { name: "show_names", selector: { boolean: {} } },
      ],
    };
  }

  // ---- Schemas ------------------------------------------------------------

  private _mainSchema(): Schema[] {
    const t = this._t;
    if (this.kind === "shortcuts") return [this._layoutGrid(), this._tileGrid()];
    return [
      this._layoutGrid(),
      {
        name: "sections",
        selector: {
          select: {
            multiple: true,
            reorder: true,
            mode: "list",
            options: SECTION_IDS.map((s) => ({ value: s, label: t(`ed_sec_${s}`) })),
          },
        },
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_greeting"),
        icon: "mdi:hand-wave-outline",
        flatten: true,
        schema: [
          { name: "title", selector: { text: {} } },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "show_date", selector: { boolean: {} } },
              { name: "center_greeting", selector: { boolean: {} } },
            ],
          },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "today_show", selector: { boolean: {} } },
              { name: "today_tomorrow", selector: { boolean: {} } },
            ],
          },
          { name: "today_calendars", selector: { entity: { multiple: true, filter: { domain: "calendar" } } } },
          { name: "today_entities", selector: { entity: { multiple: true } } },
        ],
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_status"),
        icon: "mdi:account-group-outline",
        flatten: true,
        schema: [
          { name: "persons", selector: { entity: { multiple: true, filter: { domain: "person" } } } },
          { name: "show_away", selector: { boolean: {} } },
          { name: "weather_entity", selector: { entity: { filter: { domain: "weather" } } } },
        ],
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_modes"),
        icon: "mdi:home-switch-outline",
        flatten: true,
        schema: [{ name: "mode_entity", selector: { entity: { filter: [{ domain: "input_select" }, { domain: "select" }] } } }],
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_alarm"),
        icon: "mdi:shield-home-outline",
        flatten: true,
        schema: [
          { name: "alarm_entity", selector: { entity: { filter: { domain: "alarm_control_panel" } } } },
          {
            name: "alarm_modes",
            selector: {
              select: {
                multiple: true,
                mode: "list",
                options: ALARM_MODES.map((m) => ({ value: m, label: t(`alarm_btn_${m}`) })),
              },
            },
          },
        ],
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_pulse"),
        icon: "mdi:heart-pulse",
        flatten: true,
        schema: [
          {
            name: "pulse",
            selector: {
              select: {
                multiple: true,
                reorder: true,
                mode: "list",
                options: PULSE_IDS.map((p) => ({ value: p, label: t(`g_${p}`) })),
              },
            },
          },
          { name: "show_inactive", selector: { boolean: {} } },
          { name: "nudges", selector: { boolean: {} } },
          { name: "battery_threshold", selector: { number: { min: 1, max: 100, mode: "box", unit_of_measurement: "%" } } },
          {
            name: "alert_classes",
            selector: {
              select: {
                multiple: true,
                custom_value: true,
                mode: "dropdown",
                options: ALERT_CLASS_OPTIONS.map((c) => ({ value: c, label: c.replace(/_/g, " ") })),
              },
            },
          },
          { name: "exclude_entities", selector: { entity: { multiple: true } } },
        ],
      },
      // Shortcuts configured on the overview keep working (and keep their options) until they are moved.
      ...(this._hasShortcuts() ? [this._tileGrid()] : []),
    ];
  }

  private _shortcutSchema(): Schema[] {
    const t = this._t;
    return [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ],
      },
      { name: "navigation_path", selector: { text: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "color", selector: { ui_color: {} } },
          {
            name: "badge",
            selector: {
              select: {
                mode: "dropdown",
                custom_value: true,
                options: [
                  { value: "none", label: t("ed_badge_none") },
                  ...PULSE_IDS.map((p) => ({ value: p, label: t(`g_${p}`) })),
                ],
              },
            },
          },
        ],
      },
      { name: "entity", selector: { entity: {} } },
      { name: "tap_action", selector: { ui_action: {} } },
      { name: "hold_action", selector: { ui_action: {} } },
      { name: "double_tap_action", selector: { ui_action: {} } },
    ];
  }

  private _modeSchema(): Schema[] {
    return [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ],
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "option", selector: { text: {} } },
          { name: "color", selector: { ui_color: {} } },
        ],
      },
      { name: "entity", selector: { entity: { filter: [{ domain: "scene" }, { domain: "script" }, { domain: "input_boolean" }, { domain: "switch" }] } } },
      { name: "tap_action", selector: { ui_action: {} } },
      { name: "hold_action", selector: { ui_action: {} } },
    ];
  }

  private _label = (s: { name: string }) => {
    const known = [
      "layout", "appearance", "sections", "title", "show_date", "center_greeting", "persons", "show_away",
      "weather_entity", "alarm_entity", "alarm_modes", "pulse", "show_inactive", "nudges", "battery_threshold",
      "alert_classes", "exclude_entities", "columns", "show_names", "name", "icon", "color", "navigation_path",
      "entity", "badge", "tap_action", "hold_action", "double_tap_action", "today_show", "today_tomorrow",
      "today_calendars", "today_entities", "mode_entity", "option",
    ];
    return known.includes(s.name) ? this._t(`ed_${s.name}`) : s.name;
  };

  // ---- Data mapping -------------------------------------------------------

  private _formData(): Record<string, unknown> {
    const c = this._config!;
    if (this.kind === "shortcuts") return { ...this._defaults, ...c };
    const today = typeof c.today === "object" ? c.today : {};
    return {
      ...this._defaults,
      ...c,
      today_show: c.today !== false,
      today_tomorrow: today.tomorrow !== false,
      today_calendars: today.calendars ?? [],
      today_entities: (today.entities ?? []).map((e) => (typeof e === "string" ? e : e.entity)),
    };
  }

  /** Form fields back to `today:`; entity entries that carried a name in YAML keep it. */
  private _todayFrom(v: Record<string, unknown>): HomePulseCardConfig["today"] {
    const prev = typeof this._config?.today === "object" ? this._config.today : {};
    if (v.today_show === false) return false;
    const named = new Map(
      (prev.entities ?? []).filter((e): e is { entity: string; name?: string } => typeof e === "object").map((e) => [e.entity, e])
    );
    const entities: TodayEntity[] = ((v.today_entities as string[] | undefined) ?? []).map((id) => named.get(id) ?? id);
    const next = clean({
      ...prev,
      calendars: v.today_calendars as string[] | undefined,
      entities,
      tomorrow: v.today_tomorrow === false ? false : undefined,
    } as Record<string, unknown>) as TodayConfig;
    return Object.keys(next).length ? next : undefined;
  }

  private _mainChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const v = { ...ev.detail.value } as Record<string, unknown>;
    if (this.kind === "shortcuts") {
      for (const [k, d] of Object.entries(this._defaults)) if (same(v[k], d)) delete v[k];
      this._commit(clean({ ...v, shortcuts: this._config?.shortcuts }) as unknown as HomePulseCardConfig);
      return;
    }
    const today = this._todayFrom(v);
    for (const k of ["today_show", "today_tomorrow", "today_calendars", "today_entities"]) delete v[k];
    // Drop defaults so the YAML only says what the user changed.
    for (const [k, d] of Object.entries(this._defaults)) if (same(v[k], d)) delete v[k];
    const next = clean({
      ...v,
      today,
      shortcuts: this._config?.shortcuts,
      modes: this._config?.modes,
    }) as unknown as HomePulseCardConfig;
    if (today === false) next.today = false;
    this._commit(next);
  }

  // ---- Lists (shortcuts, modes) -----------------------------------------------

  private _items(key: ListKey): Record<string, unknown>[] {
    return [...((this._config?.[key] as Record<string, unknown>[] | undefined) ?? [])];
  }

  private _setItems(key: ListKey, items: Record<string, unknown>[]) {
    this._commit(clean({ ...this._config!, [key]: items }) as unknown as HomePulseCardConfig);
  }

  private _itemChanged(key: ListKey, i: number, ev: CustomEvent) {
    ev.stopPropagation();
    const items = this._items(key);
    const value = { ...ev.detail.value } as Record<string, unknown>;
    if (value.badge === "none") delete value.badge;
    items[i] = clean(value);
    this._setItems(key, items);
  }

  private _addItem(key: ListKey) {
    const items = this._items(key);
    items.push(key === "shortcuts" ? { icon: "mdi:view-dashboard-outline" } : {});
    this._open = new Set([...this._open, `${key}:${items.length - 1}`]);
    this._setItems(key, items);
  }

  private _removeItem(key: ListKey, i: number) {
    const items = this._items(key);
    items.splice(i, 1);
    this._open = new Set();
    this._setItems(key, items);
  }

  private _moveItem(key: ListKey, i: number, dir: -1 | 1) {
    const items = this._items(key);
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    this._open = new Set();
    this._setItems(key, items);
  }

  private _toggleOpen(id: string) {
    const open = new Set(this._open);
    open.has(id) ? open.delete(id) : open.add(id);
    this._open = open;
  }

  private _commit(config: HomePulseCardConfig) {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  // ---- Render -------------------------------------------------------------

  protected render() {
    if (!this.hass || !this._config || !this._ready) return nothing;
    const modes = (this._config.modes ?? []) as ModeConfig[];
    const form = html`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._mainSchema()}
        .computeLabel=${this._label}
        @value-changed=${this._mainChanged}
      ></ha-form>
    `;
    if (this.kind === "shortcuts") return html`${form}${this._renderShortcutList()}`;
    return html`
      ${form}
      ${this._config.chips?.length ? nothing : html`<p class="hint">${this._t("ed_chips_yaml")}</p>`}

      <div class="section">
        <div class="section-title"><ha-icon icon="mdi:home-switch-outline"></ha-icon>${this._t("ed_section_modes")}</div>
        <p class="hint">${this._t(this._config.mode_entity && !modes.length ? "ed_modes_hint_auto" : "ed_modes_hint")}</p>
        ${modes.map((m, i) =>
          this._renderItem("modes", m as Record<string, unknown>, i, modes.length, m.name || m.option || m.entity || this._t("ed_mode_n", { n: i + 1 }), m.icon, this._modeSchema(), {})
        )}
        <button class="add" @click=${() => this._addItem("modes")}>
          <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_mode")}
        </button>
      </div>

      ${this._hasShortcuts()
        ? this._renderShortcutList(this._t("ed_shortcuts_move"))
        : html`<div class="section">
            <div class="section-title"><ha-icon icon="mdi:view-grid-outline"></ha-icon>${this._t("ed_section_shortcuts")}</div>
            <p class="hint">${this._t("ed_shortcuts_own_card")}</p>
          </div>`}
    `;
  }

  /** The reorderable shortcut list, shared by both editors. */
  private _renderShortcutList(hint?: string) {
    const shortcuts = (this._config?.shortcuts ?? []) as ShortcutConfig[];
    return html`
      <div class="section">
        <div class="section-title"><ha-icon icon="mdi:view-grid-outline"></ha-icon>${this._t("ed_section_shortcuts")}</div>
        ${hint ? html`<p class="hint">${hint}</p>` : nothing}
        ${shortcuts.map((sc, i) =>
          this._renderItem(
            "shortcuts",
            sc as Record<string, unknown>,
            i,
            shortcuts.length,
            sc.name || sc.navigation_path || sc.entity || this._t("ed_shortcut_n", { n: i + 1 }),
            sc.icon,
            this._shortcutSchema(),
            { badge: "none" }
          )
        )}
        <button class="add" @click=${() => this._addItem("shortcuts")}>
          <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_shortcut")}
        </button>
      </div>
    `;
  }

  private _renderItem(
    key: ListKey,
    item: Record<string, unknown>,
    i: number,
    total: number,
    title: string,
    icon: string | undefined,
    schema: Schema[],
    defaults: Record<string, unknown>
  ) {
    const id = `${key}:${i}`;
    const open = this._open.has(id);
    return html`
      <div class="item">
        <div class="item-head">
          <button class="head-main" @click=${() => this._toggleOpen(id)} aria-expanded=${String(open)}>
            <ha-icon .icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
            ${icon ? html`<ha-icon class="sc-icon" .icon=${icon}></ha-icon>` : nothing}
            <span>${title}</span>
          </button>
          <button class="icon-btn" title=${this._t("ed_move_up")} ?disabled=${i === 0} @click=${() => this._moveItem(key, i, -1)}>
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
          <button class="icon-btn" title=${this._t("ed_move_down")} ?disabled=${i === total - 1} @click=${() => this._moveItem(key, i, 1)}>
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
          <button class="icon-btn danger" title=${this._t("ed_remove")} @click=${() => this._removeItem(key, i)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${open
          ? html`
              <div class="item-body">
                <ha-form
                  .hass=${this.hass}
                  .data=${{ ...defaults, ...item }}
                  .schema=${schema}
                  .computeLabel=${this._label}
                  @value-changed=${(e: CustomEvent) => this._itemChanged(key, i, e)}
                ></ha-form>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; }
    .section { margin-top: 24px; display: flex; flex-direction: column; gap: 8px; }
    .section-title {
      display: flex; align-items: center; gap: 8px;
      font-weight: 500; font-size: 15px; color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .section-title ha-icon { color: var(--secondary-text-color); }
    .item { border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden; }
    .item-head { display: flex; align-items: center; gap: 2px; padding: 4px; }
    button {
      font: inherit; color: var(--primary-text-color); background: none; border: none; cursor: pointer;
      border-radius: 8px; --mdc-icon-size: 20px;
    }
    button:hover:not([disabled]) { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    button[disabled] { opacity: 0.35; cursor: default; }
    .head-main { flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px; text-align: left; min-width: 0; }
    .head-main span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sc-icon { color: var(--secondary-text-color); }
    .icon-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
    .icon-btn.danger ha-icon { color: var(--error-color, #db4437); }
    .item-body { padding: 4px 12px 12px; border-top: 1px solid var(--divider-color); }
    .hint { margin: 8px 0 0; font-size: 13px; color: var(--secondary-text-color); }
    .add {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 10px; border: 1px dashed var(--divider-color); border-radius: 12px; color: var(--primary-color);
      font-weight: 500;
    }
  `;
}

/** Editor of Home Pulse Shortcuts: layout, tiles per row, names, and the shortcut list. */
export class HomePulseShortcutsCardEditor extends HomePulseCardEditor {
  protected kind: "overview" | "shortcuts" = "shortcuts";
}

if (!customElements.get("home-pulse-card-editor")) {
  customElements.define("home-pulse-card-editor", HomePulseCardEditor);
  customElements.define("home-pulse-shortcuts-card-editor", HomePulseShortcutsCardEditor);
}
