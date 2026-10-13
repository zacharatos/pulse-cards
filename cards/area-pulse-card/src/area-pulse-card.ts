import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";

import type {
  ActionConfig,
  AreaPulseCardConfig,
  AreaRegistryEntry,
  GroupId,
  HassEntity,
  HomeAssistant,
  LabelRegistryEntry,
} from "./types";
import {
  buildGroups,
  chipTone,
  comfortState,
  DEFAULT_GROUPS,
  DEFAULT_MAX_CHIPS,
  DEFAULT_TOP_GROUPS,
  entityReadings,
  findMainLight,
  glowAlpha,
  indexArea,
  lightColor,
  pickChips,
  readingSeverity,
  reading,
  watchedEntities,
  type AreaIndex,
  type ChipCandidate,
  type Group,
  type Reading,
} from "./discovery";
import { hasLabelFilter, loadLabelRegistry, resolveLabelFilter, type ResolvedLabelFilter } from "./labels";
import { actionIconColor, cssColor, resolveAction, type ResolvedAction } from "./presets";
import {
  buildRoom,
  isActiveState,
  matchesQuery,
  roomLabels,
  RUNNABLE_SERVICE,
  tileConfig,
  type RoomLabel,
  type RoomModel,
  type RoomSection,
} from "./room";
import { resolveModes, type ResolvedMode } from "./modes";
import { actionHandler, type ActionKind } from "./action-handler";
import { localize } from "./localize";
import { cardStyles } from "./styles";
import { popupStyles } from "./popup-styles";
import "./editor";


interface CardHelpers {
  createCardElement: (config: Record<string, unknown>) => HTMLElement | Promise<HTMLElement>;
}

/** A chip candidate plus what the card needs to place and draw it. */
interface ChipItem extends ChipCandidate {
  top: boolean;
  render: () => TemplateResult;
}

/** Icon colour per tone with `chip_colors: state`; no tone keeps the neutral secondary text colour. */
const TONE_COLOR: Record<ReturnType<typeof chipTone>, string> = {
  "": "var(--secondary-text-color)",
  on: "var(--apc-amber)",
  warn: "var(--apc-orange)",
  bad: "var(--apc-red)",
};

interface GroupMeta {
  icon: string;
  iconOff: string;
  color: string;
}

const GROUP_META: Record<GroupId, GroupMeta> = {
  presence: { icon: "mdi:account", iconOff: "mdi:account-outline", color: "var(--apc-green)" },
  motion: { icon: "mdi:motion-sensor", iconOff: "mdi:motion-sensor-off", color: "var(--apc-cyan)" },
  doors: { icon: "mdi:door-open", iconOff: "mdi:door-closed", color: "var(--apc-orange)" },
  windows: { icon: "mdi:window-open-variant", iconOff: "mdi:window-closed-variant", color: "var(--apc-orange)" },
  covers: { icon: "mdi:window-shutter-open", iconOff: "mdi:window-shutter", color: "var(--apc-purple)" },
  locks: { icon: "mdi:lock-open-variant", iconOff: "mdi:lock", color: "var(--apc-deep-orange)" },
  lights: { icon: "mdi:lightbulb-on", iconOff: "mdi:lightbulb-outline", color: "var(--apc-amber)" },
  fans: { icon: "mdi:fan", iconOff: "mdi:fan-off", color: "var(--apc-light-blue)" },
  switches: { icon: "mdi:power-socket-eu", iconOff: "mdi:power-plug-off-outline", color: "var(--apc-teal)" },
  media: { icon: "mdi:play-circle", iconOff: "mdi:speaker", color: "var(--apc-indigo)" },
  climate: { icon: "mdi:thermostat", iconOff: "mdi:thermostat", color: "var(--apc-deep-orange)" },
  alerts: { icon: "mdi:alert", iconOff: "mdi:shield-check", color: "var(--apc-red)" },
  batteries: { icon: "mdi:battery-alert-variant-outline", iconOff: "mdi:battery", color: "var(--apc-red)" },
};

const SENSOR_ICONS: Record<string, string> = {
  illuminance: "mdi:brightness-5",
  aqi: "mdi:leaf",
  carbon_dioxide: "mdi:molecule-co2",
  carbon_monoxide: "mdi:molecule-co",
  pm1: "mdi:grain",
  pm25: "mdi:blur",
  pm10: "mdi:blur-radial",
  volatile_organic_compounds: "mdi:air-filter",
  volatile_organic_compounds_parts: "mdi:air-filter",
  nitrogen_dioxide: "mdi:molecule",
  nitrogen_monoxide: "mdi:molecule",
  nitrous_oxide: "mdi:molecule",
  ozone: "mdi:molecule",
  sulphur_dioxide: "mdi:molecule",
  pressure: "mdi:gauge",
  power: "mdi:flash",
  energy: "mdi:lightning-bolt",
  sound_pressure: "mdi:waveform",
  temperature: "mdi:thermometer",
  humidity: "mdi:water-percent",
};

const DEFAULT_ICON = "mdi:texture-box";

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
  interface HTMLElementTagNameMap {
    "area-pulse-card": AreaPulseCard;
  }
}

export class AreaPulseCard extends LitElement {
  static styles = [cardStyles, popupStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ reflect: true }) layout: "default" | "compact" = "default";
  @property({ type: Boolean, reflect: true }) dark = false;
  @state() private _config?: AreaPulseCardConfig;
  /** Group shown in the popup. */
  @state() private _popup?: GroupId;
  /** Native tile cards for the popup; null means HA's card helpers are unavailable and fallback tiles are drawn. */
  @state() private _tiles?: HTMLElement[] | null;
  /** Popup to restore after a more-info dialog opened from it is closed. */
  private _reopen?: GroupId | "room";
  private _onDialogClosed = () => {
    if (this._reopen) {
      const id = this._reopen;
      this._reopen = undefined;
      if (id === "room") this._openRoom(true);
      else this._openPopup(id);
    }
  };

  /** Room popup: the layout is decided when it opens so rows never move while you use them. */
  @state() private _room = false;
  private _roomModel?: RoomModel;
  private _roomLabels: Record<string, RoomLabel> = {};
  /** Native tiles of the room popup, created lazily; null means HA's card helpers are unavailable. */
  @state() private _roomTiles?: Map<string, HTMLElement> | null;
  @state() private _roomUi: { query: string; collapsed: Set<string>; expanded: Set<string> } = {
    query: "",
    collapsed: new Set(),
    expanded: new Set(),
  };
  private _roomScroll = 0;

  /** Label registry, needed only to resolve label names in `label_filter` to IDs. */
  @state() private _labelRegistry?: LabelRegistryEntry[];
  private _labelsRequested = false;
  private _labelFilter?: ResolvedLabelFilter;

  private _index?: AreaIndex;
  private _indexDeps: unknown[] = [];
  private _watched = new Set<string>();
  private _ticker?: number;

  // ---- Lovelace API -------------------------------------------------------

  static getConfigElement() {
    return document.createElement("area-pulse-card-editor");
  }

  static getStubConfig(hass: HomeAssistant): Partial<AreaPulseCardConfig> {
    const areas = Object.values(hass?.areas ?? {});
    return {
      area: areas[0]?.area_id ?? "",
      actions: [{ preset: "lights_toggle" }, { preset: "everything_off" }],
    };
  }

  setConfig(config: AreaPulseCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    if (config.actions && !Array.isArray(config.actions)) throw new Error("`actions` must be a list");
    if (config.label_filter && (typeof config.label_filter !== "object" || Array.isArray(config.label_filter)))
      throw new Error("`label_filter` must be a map with `include` and/or `exclude`");
    if (config.chip_colors !== undefined && config.chip_colors !== "state" && config.chip_colors !== "category")
      throw new Error("`chip_colors` must be `state` or `category`");
    if (config.max_chips !== undefined && !(Number.isInteger(config.max_chips) && config.max_chips >= 0))
      throw new Error("`max_chips` must be a whole number, 0 or more (0 shows every chip)");
    if (config.sensor_entities !== undefined && !Array.isArray(config.sensor_entities))
      throw new Error("`sensor_entities` must be a list of entities");
    if (config.modes !== undefined && !Array.isArray(config.modes)) throw new Error("`modes` must be a list");
    this._config = { ...config };
    this.layout = config.layout === "compact" ? "compact" : "default";
    this._popup = undefined;
    this._room = false;
    this._indexDeps = [];
  }

  getCardSize(): number {
    const actions = this._config?.actions?.length ? 1 : 0;
    const modes = this._config?.mode_entity || this._config?.modes?.length ? 1 : 0;
    return (this.layout === "compact" ? 2 : 3) + actions + modes;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" as const };
  }

  // ---- Lifecycle ----------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    // Keeps "for 12 min" labels fresh without depending on state changes.
    this._ticker = window.setInterval(() => this.requestUpdate(), 30_000);
    window.addEventListener("dialog-closed", this._onDialogClosed);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._ticker) window.clearInterval(this._ticker);
    window.removeEventListener("dialog-closed", this._onDialogClosed);
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    // Popup tiles are real cards: keep them live even when nothing on this card changed.
    if (changed.has("hass") && this.hass) {
      const hass = this.hass;
      for (const t of this._tiles ?? []) this._syncTile(t, hass);
      for (const t of this._roomTiles?.values() ?? []) this._syncTile(t, hass);
    }
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    const hass = this.hass;
    if (!old || !hass) return true;
    if (
      old.entities !== hass.entities ||
      old.devices !== hass.devices ||
      old.areas !== hass.areas ||
      old.locale !== hass.locale ||
      old.language !== hass.language ||
      old.themes !== hass.themes
    ) {
      return true;
    }
    for (const id of this._watched) if (old.states[id] !== hass.states[id]) return true;
    return false;
  }

  protected willUpdate(): void {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return;
    this.dark = !!hass.themes?.darkMode;
    this._ensureLabelRegistry();
    const deps = [hass.entities, hass.devices, hass.areas, config, this._labelRegistry];
    if (!this._index || deps.some((d, i) => d !== this._indexDeps[i])) {
      this._labelFilter = resolveLabelFilter(config.label_filter, this._labelRegistry);
      this._index = indexArea(hass, config.area, config.exclude_entities ?? [], this._labelFilter);
      this._indexDeps = deps;
      const area = hass.areas?.[config.area];
      this._watched = watchedEntities(config, this._index);
      if (area?.temperature_entity_id) this._watched.add(area.temperature_entity_id);
      if (area?.humidity_entity_id) this._watched.add(area.humidity_entity_id);
    }
  }

  /** Label names in the config need the registry to become IDs. IDs work without it. */
  private _ensureLabelRegistry() {
    if (this._labelsRequested || !this.hass || !hasLabelFilter(this._config?.label_filter)) return;
    this._labelsRequested = true;
    loadLabelRegistry(this.hass)
      .then((registry) => (this._labelRegistry = registry))
      .catch(() => undefined); // keep going with IDs only
  }

  /** The area index, computed on demand when render runs before willUpdate has cached one. */
  private _getIndex(): AreaIndex {
    const { hass, _config: config } = this;
    return (
      this._index ??
      indexArea(
        hass!,
        config!.area,
        config!.exclude_entities ?? [],
        resolveLabelFilter(config!.label_filter, this._labelRegistry)
      )
    );
  }

  // ---- Render -------------------------------------------------------------

  protected render(): TemplateResult | typeof nothing {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return nothing;
    if (!config.area) return this._warning(localize(hass, "pick_area"));
    const area = hass.areas?.[config.area];
    if (!area) return this._warning(localize(hass, "area_not_found", { area: config.area }));
    const index = this._getIndex();

    const groups = buildGroups(hass, config, index);
    const temperature = reading(hass, index, "temperature", config.temperature_entity ?? area.temperature_entity_id);
    const humidity = reading(hass, index, "humidity", config.humidity_entity ?? area.humidity_entity_id);
    const extras = [
      ...(config.sensor_classes ?? []).map((c) => reading(hass, index, c)).filter((r): r is Reading => !!r),
      ...entityReadings(hass, config.sensor_entities),
    ];
    const actions = (config.actions ?? []).map((a) => resolveAction(hass, a, area, groups, index, !!this._labelFilter?.active));

    const presence = groups.presence;
    const occupied = !!presence?.active.length;
    const alerts = groups.alerts?.active ?? [];
    const accent = config.color ? cssColor(config.color) : undefined;
    const showPicture = config.show_picture !== false && !!area.picture;
    const roomEnabled = this._roomEnabled(index);
    const headerHasAction =
      this._hasAction(config.tap_action) || this._hasAction(config.hold_action) || (roomEnabled && !config.tap_action);

    // Main light drives the icon and the ambient glow colour.
    const mainLight = findMainLight(hass, config, index);
    const mainState = mainLight ? hass.states[mainLight] : undefined;
    const mainOn = mainState?.state === "on";
    const glowSource = mainOn
      ? mainState
      : (groups.lights?.active ?? []).map((id) => hass.states[id]).find((s) => !!s);
    // A light without a colour of its own glows in the theme's "on" colour (--apc-glow-rgb in styles.ts).
    const glowRgb = glowSource ? lightColor(glowSource) : undefined;
    const glowStrength = glowAlpha(glowSource);
    const mainRgb = mainOn ? lightColor(mainState) : undefined;

    const cardStyle: Record<string, string> = {};
    if (accent) cardStyle["--apc-accent"] = accent;
    if (glowRgb) cardStyle["--apc-glow-rgb"] = glowRgb.join(",");
    if (glowSource) cardStyle["--apc-glow-alpha"] = glowStrength.toFixed(3);
    if (mainRgb) cardStyle["--apc-light-rgb"] = mainRgb.join(",");
    const colors = config.colors ?? {};
    if (colors.temperature_low) cardStyle["--apc-temp-low"] = cssColor(colors.temperature_low);
    if (colors.temperature_high) cardStyle["--apc-temp-high"] = cssColor(colors.temperature_high);
    if (colors.humidity_low) cardStyle["--apc-hum-low"] = cssColor(colors.humidity_low);
    if (colors.humidity_high) cardStyle["--apc-hum-high"] = cssColor(colors.humidity_high);

    const iconClasses = {
      "area-icon": true,
      occupied: occupied && !mainLight,
      linked: !!mainLight,
      "light-on": mainOn,
    };
    const chips = this._chipModel(groups, roomEnabled);
    const onFace = new Set(chips.shown.map((c) => c.group).filter((g): g is GroupId => !!g));
    const icon = html`<ha-icon .icon=${config.icon || area.icon || DEFAULT_ICON}></ha-icon>`;
    const dot = occupied ? html`<span class="presence-dot"></span>` : nothing;

    return html`
      <ha-card class=${classMap({ alerting: alerts.length > 0 })} style=${styleMap(cardStyle)}>
        ${showPicture ? html`<div class="picture" style=${styleMap({ backgroundImage: `url("${area.picture}")` })}></div>` : nothing}
        <div class=${classMap({ glow: true, on: !!glowSource })}></div>
        <div class="content">
          <div
            class=${classMap({ header: true, clickable: headerHasAction })}
            role=${headerHasAction ? "button" : nothing}
            tabindex=${headerHasAction ? "0" : nothing}
            ${actionHandler({
              hasHold: this._hasAction(config.hold_action),
              hasDoubleTap: this._hasAction(config.double_tap_action),
              disabled: !headerHasAction,
            })}
            @apc-action=${(ev: CustomEvent) => this._cardAction(ev.detail.action)}
          >
            ${mainLight
              ? html`<div
                  class=${classMap(iconClasses)}
                  role="button"
                  tabindex="0"
                  aria-pressed=${String(mainOn)}
                  aria-label=${localize(hass, "toggle_light", { name: this._entityName(mainState) })}
                  title=${this._entityName(mainState)}
                  ${actionHandler({ hasHold: true })}
                  @apc-action=${(ev: CustomEvent) => this._mainLightAction(mainLight, ev.detail.action)}
                  @pointerdown=${this._stop}
                  @pointerup=${this._stop}
                  @click=${this._stop}
                  @keydown=${this._stop}
                >
                  ${icon}${dot}
                </div>`
              : html`<div class=${classMap(iconClasses)}>${icon}${dot}</div>`}
            <div class="titles">
              <div class="name">${config.name || area.name}</div>
              <div class="secondary">${this._secondary(groups, onFace)}</div>
            </div>
            ${this._renderClimate(temperature, humidity, extras)}
          </div>
          ${this._renderLabelHint(index)}
          ${alerts.length ? keyed(alerts.join(), this._renderAlertBanner(alerts)) : nothing}
          ${this._renderChips(chips)}
          ${this._renderModes()}
          ${actions.length ? this._renderActions(actions) : nothing}
        </div>
      </ha-card>
      ${this._popup && groups[this._popup] ? this._renderPopup(groups[this._popup]!, area) : nothing}
      ${this._room ? this._renderRoom(area, groups, temperature, humidity) : nothing}
    `;
  }

  private _stop = (ev: Event) => ev.stopPropagation();

  /** Explain an empty card when a label filter, not an empty area, is the reason. */
  private _renderLabelHint(index: AreaIndex) {
    const filter = this._labelFilter;
    if (!filter?.active || filter.include.size === 0) return nothing;
    if (index.primary.length > 0 || index.unfilteredCount === 0) return nothing;
    return html`
      <div class="hint">
        <ha-icon icon="mdi:label-off-outline"></ha-icon>
        <span>${localize(this.hass, "no_label_match", { labels: filter.includeNames.join(", ") })}</span>
      </div>
    `;
  }

  private _warning(text: string) {
    return html`<ha-card><div class="warning"><ha-icon icon="mdi:alert-outline"></ha-icon>${text}</div></ha-card>`;
  }

  /** Subtitle. Leaves out what a chip on the card face already says (`onFace`). */
  private _secondary(groups: Partial<Record<GroupId, Group>>, onFace: ReadonlySet<GroupId> = new Set()) {
    const hass = this.hass!;
    const parts: string[] = [];
    const presence = groups.presence;
    if (presence) {
      const occupied = presence.active.length > 0;
      const since = this._lastChange(occupied ? presence.active : presence.entities);
      const label = localize(hass, occupied ? "occupied" : "clear");
      parts.push(since !== undefined ? `${label} ${localize(hass, "for", { t: this._ago(since) })}` : label);
    }
    const lights = groups.lights;
    if (lights?.active.length && !onFace.has("lights")) {
      parts.push(
        localize(hass, lights.active.length === 1 ? "light_on" : "lights_on_n", { n: lights.active.length })
      );
    }
    if (!parts.length) {
      const media = groups.media;
      if (media?.active.length && !onFace.has("media")) parts.push(localize(hass, "media_playing"));
    }
    return parts.map((p, i) => html`${i ? html`<span class="dot">·</span>` : nothing}${p}`);
  }

  /**
   * The right-hand block: temperature large, then humidity and the `sensor_classes` readings as a small
   * line that wraps. A value is coloured only when it is out of range.
   */
  private _renderClimate(temp?: Reading, hum?: Reading, extras: Reading[] = []) {
    if (!temp && !hum && !extras.length) return nothing;
    const config = this._config!;
    const tempUnit = temp?.unit || "°";
    const tState = temp
      ? comfortState(temp.value, config.comfort_temperature, tempUnit.includes("F") ? [68, 76] : [19, 25])
      : "ok";
    const hState = hum ? comfortState(hum.value, config.comfort_humidity, [35, 65]) : "ok";
    return html`
      <div class="climate">
        ${temp
          ? html`<div
              class="temp ${tState}"
              title=${temp.entities.length > 1 ? `Median of ${temp.entities.length} sensors` : ""}
              @click=${(e: Event) => this._moreInfo(temp.entities[0], e)}
            >
              ${this._num(temp.value, 1)}<span class="unit">${tempUnit}</span>
            </div>`
          : nothing}
        ${hum || extras.length
          ? html`<div class="readings">
              ${hum
                ? html`<div class="hum ${hState}" @click=${(e: Event) => this._moreInfo(hum.entities[0], e)}>
                    <ha-icon .icon=${hState === "low" ? "mdi:water-percent-alert" : "mdi:water-percent"}></ha-icon>${this._num(hum.value, 0)}${hum.unit}
                  </div>`
                : nothing}
              ${extras.map((r) => {
                const severity = readingSeverity(r);
                const s = this.hass!.states[r.entities[0]];
                // A sensor named by entity may have no device class: its own icon, then the class's, then a gauge.
                const pinned = config.sensor_entities?.includes(r.entities[0]) && r.entities.length === 1;
                const icon = (pinned ? (s?.attributes.icon as string | undefined) : undefined) ?? SENSOR_ICONS[r.deviceClass] ?? "mdi:gauge";
                return html`<div
                  class="hum reading ${severity}"
                  title=${this._entityName(s)}
                  @click=${(e: Event) => this._moreInfo(r.entities[0], e)}
                >
                  <ha-icon .icon=${icon}></ha-icon>${this._num(r.value, Math.abs(r.value) >= 100 ? 0 : 1)}${r.unit ? ` ${r.unit}` : ""}
                </div>`;
              })}
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderAlertBanner(alerts: string[]) {
    const hass = this.hass!;
    const first = hass.states[alerts[0]];
    const text =
      alerts.length === 1
        ? `${this._entityName(first)} · ${this._formatState(first)}`
        : `${localize(hass, "alerts_n", { n: alerts.length })}: ${alerts
            .map((a) => this._entityName(hass.states[a]))
            .join(", ")}`;
    return html`
      <div
        class="alert-banner"
        role="alert"
        @click=${() => (alerts.length === 1 ? this._moreInfo(alerts[0]) : this._openPopup("alerts"))}
      >
        <ha-icon icon="mdi:alert"></ha-icon>
        <span class="text">${text}</span>
      </div>
    `;
  }

  /**
   * Which chips go on the card face. With a cap (`max_chips`, default 3) the face shows the most
   * important ones in one row and a "+N" chip opens the room popup; without the room popup, or with
   * `max_chips: 0`, every chip shows in the configured order and rows (`top_groups`).
   */
  private _chipModel(groups: Partial<Record<GroupId, Group>>, roomEnabled: boolean) {
    const config = this._config!;
    const order = (config.groups ?? DEFAULT_GROUPS).filter((g) => g !== "presence");
    const top = new Set(config.top_groups ?? DEFAULT_TOP_GROUPS);
    const showInactive = config.show_inactive === true;
    const items: ChipItem[] = [];

    for (const id of order) {
      const group = groups[id];
      if (!group) continue;
      // Alerts already have a banner; batteries only matter when low.
      if (id === "alerts" && (this.layout !== "compact" || !group.active.length)) continue;
      if (id === "batteries" && !group.active.length) continue;
      if (!group.active.length && !showInactive) continue;
      items.push({ group: id, active: group.active.length > 0, top: top.has(id), render: () => this._groupChip(group) });
    }

    const max = roomEnabled ? config.max_chips ?? DEFAULT_MAX_CHIPS : 0;
    return { ...pickChips(items, max), capped: max > 0 };
  }

  private _renderChips(chips: { shown: ChipItem[]; hidden: ChipItem[]; capped: boolean }) {
    const { shown, hidden, capped } = chips;
    if (!shown.length) return nothing;
    if (capped) {
      const hass = this.hass!;
      return html`
        <div class="chip-rows">
          <div class="chips">
            ${shown.map((c) => c.render())}
            ${hidden.length
              ? html`<button
                  class="chip more"
                  aria-haspopup="dialog"
                  aria-label=${localize(hass, "more_n", { n: hidden.length })}
                  title=${localize(hass, "more_n", { n: hidden.length })}
                  @click=${() => this._openRoom()}
                >
                  <span class="label">+${hidden.length}</span>
                </button>`
              : nothing}
          </div>
        </div>
      `;
    }
    const row1 = shown.filter((c) => c.top).map((c) => c.render());
    const row2 = shown.filter((c) => !c.top).map((c) => c.render());
    return html`
      <div class="chip-rows">
        ${row1.length ? html`<div class="chips">${row1}</div>` : nothing}
        ${row2.length ? html`<div class="chips">${row2}</div>` : nothing}
      </div>
    `;
  }

  /** `chip_colors: state` (the default): colour only where it means something. */
  private get _calmChips(): boolean {
    return this._config?.chip_colors !== "category";
  }

  private _groupChip(group: Group) {
    const meta = GROUP_META[group.id];
    const active = group.active.length > 0;
    const calm = this._calmChips;
    let color = calm ? TONE_COLOR[chipTone(group.id)] : meta.color;
    let icon = active ? meta.icon : meta.iconOff;
    let label = this._groupLabel(group);

    if (group.id === "climate") {
      const s = this.hass!.states[group.active[0] ?? group.entities[0]];
      const action = String(s?.attributes.hvac_action ?? (s?.state === "off" ? "off" : "idle"));
      if (action === "cooling") { if (!calm) color = "var(--apc-blue)"; icon = "mdi:snowflake"; }
      else if (action === "heating") { icon = "mdi:fire"; }
      else if (action === "drying") { if (!calm) color = "var(--apc-amber)"; icon = "mdi:water-percent"; }
      else if (action === "fan") { if (!calm) color = "var(--apc-light-blue)"; icon = "mdi:fan"; }
      label = this._climateLabel(s, action);
    }

    return html`
      <button
        class=${classMap({ chip: true, active, calm, selected: this._popup === group.id })}
        style=${styleMap({ "--c": color })}
        aria-haspopup=${group.entities.length > 1 ? "dialog" : nothing}
        @click=${() => this._chipClick(group)}
      >
        <ha-icon .icon=${icon}></ha-icon>
        <span class="label">${label}</span>
      </button>
    `;
  }

  private _groupLabel(group: Group): string {
    const hass = this.hass!;
    const n = group.active.length;
    const pick = (one: string, many: string, none: string) =>
      n === 0 ? localize(hass, none) : localize(hass, n === 1 ? one : many, { n });
    switch (group.id) {
      case "motion":
        return localize(hass, n ? "motion" : "no_motion");
      case "doors":
        return pick("door_open", "doors_open", "doors_closed");
      case "windows":
        return pick("window_open", "windows_open", "windows_closed");
      case "covers":
        return pick("cover_open", "covers_open_n", "covers_closed");
      case "locks":
        return pick("lock_unlocked", "lock_unlocked", "locks_locked");
      case "lights":
        return pick("light_on", "lights_on_n", "lights_off_all");
      case "fans":
        return pick("fan_on", "fans_on_n", "fans_off_all");
      case "switches":
        return pick("switch_on", "switches_on_n", "switches_off_all");
      case "media": {
        if (!n) return localize(hass, "media_idle");
        const s = hass.states[group.active[0]];
        const title = s.attributes.media_title as string | undefined;
        return n === 1 && title ? title : localize(hass, "media_playing");
      }
      case "alerts":
        return n === 1 ? localize(hass, "alert") : localize(hass, "alerts_n", { n });
      case "batteries":
        return localize(hass, n === 1 ? "battery_low" : "batteries_low", { n });
      default:
        return "";
    }
  }

  private _climateLabel(s: HassEntity | undefined, action: string): string {
    const hass = this.hass!;
    if (!s) return "";
    const key = `climate_${action}`;
    const base = ["heating", "cooling", "drying", "fan", "idle", "off"].includes(action)
      ? localize(hass, key)
      : this._formatState(s);
    const target = s.attributes.temperature as number | undefined;
    const low = s.attributes.target_temp_low as number | undefined;
    const high = s.attributes.target_temp_high as number | undefined;
    if (s.state === "off") return base;
    if (typeof target === "number") return `${base} · ${this._num(target, 1)}°`;
    if (typeof low === "number" && typeof high === "number")
      return `${base} · ${this._num(low, 0)}–${this._num(high, 0)}°`;
    return base;
  }

  private _renderActions(actions: ResolvedAction[]) {
    return html`
      <div class=${classMap({ actions: true, dense: actions.length >= 4 })}>
        ${actions.map(
          (a) => html`
            <button
              class=${classMap({ action: true, active: a.active })}
              style=${styleMap({ "--c": a.color, "--apc-action-icon": actionIconColor(a, this._calmChips) })}
              title=${a.name}
              aria-label=${a.name}
              ?disabled=${a.disabled}
              ${actionHandler({
                hasHold: this._hasAction(a.hold_action),
                hasDoubleTap: this._hasAction(a.double_tap_action),
                disabled: a.disabled,
              })}
              @apc-action=${(ev: CustomEvent) => this._quickAction(a, ev.detail.action)}
            >
              <ha-icon .icon=${a.icon}></ha-icon>
              <span class="label">${a.name}</span>
            </button>
          `
        )}
      </div>
    `;
  }

  /** Room modes: a segmented row like Home Pulse's house modes, the current mode lit. Off until configured. */
  private _renderModes() {
    const config = this._config!;
    if (!config.mode_entity && !config.modes?.length) return nothing;
    const modes = resolveModes(this.hass!, config);
    if (!modes.length) return nothing;
    return html`
      <div class="modes" role="group">
        ${modes.map((m) => this._renderMode(m))}
      </div>
    `;
  }

  private _renderMode(m: ResolvedMode) {
    const named = this._config!.show_mode_names !== false && !!m.name;
    const title = m.resetTo !== undefined ? `${m.name} · ${localize(this.hass, "mode_back_to", { mode: m.resetTo })}` : m.name;
    return html`
      <button
        class=${classMap({ mode: true, active: m.active, "icon-only": !named })}
        style=${styleMap({ "--c": m.color ? cssColor(m.color) : "var(--apc-accent)" })}
        aria-pressed=${String(m.active)}
        aria-label=${title}
        title=${title}
        ${actionHandler({ hasHold: !!m.hold_action })}
        @apc-action=${(ev: CustomEvent<{ action: ActionKind }>) =>
          this._fireAction({ entity: m.entity, tap_action: m.tap_action, hold_action: m.hold_action }, ev.detail.action)}
      >
        <ha-icon .icon=${m.icon}></ha-icon>
        ${named ? html`<span class="mode-name">${m.name}</span>` : nothing}
      </button>
    `;
  }

  // ---- Interaction --------------------------------------------------------

  private _hasAction(a?: ActionConfig): boolean {
    return !!a && a.action !== "none";
  }

  private _chipClick(group: Group) {
    if (group.entities.length === 1) {
      this._moreInfo(group.entities[0]);
      return;
    }
    this._openPopup(group.id);
  }

  private _mainLightAction(entity: string, action: ActionKind) {
    if (action === "hold") this._moreInfo(entity);
    else this._fireAction({ entity, tap_action: { action: "toggle" } }, "tap");
  }

  private _cardAction(action: ActionKind) {
    const c = this._config!;
    // No tap action configured: the card's own room popup is the default.
    if (action === "tap" && !c.tap_action && this._roomEnabled(this._getIndex())) {
      this._openRoom();
      return;
    }
    this._fireAction(
      { tap_action: c.tap_action, hold_action: c.hold_action, double_tap_action: c.double_tap_action },
      action
    );
  }

  private _quickAction(a: ResolvedAction, action: ActionKind) {
    this._fireAction(
      { entity: a.entity, tap_action: a.tap_action, hold_action: a.hold_action, double_tap_action: a.double_tap_action },
      action
    );
  }

  /** Hand the action to Home Assistant's own handler (confirmation, navigate, perform-action, etc.). */
  private _fireAction(
    config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    action: ActionKind
  ) {
    const actionConfig = config[`${action}_action` as const];
    if (!this._hasAction(actionConfig)) return;
    this.dispatchEvent(
      new CustomEvent("hass-action", { bubbles: true, composed: true, detail: { config, action } })
    );
  }

  private _moreInfo(entityId?: string, ev?: Event) {
    ev?.stopPropagation();
    if (!entityId) return;
    if (this._popup || this._room) this._onPopupMoreInfo();
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId } })
    );
  }

  // ---- Popup --------------------------------------------------------------

  private _currentGroups(): Partial<Record<GroupId, Group>> {
    if (!this.hass || !this._config) return {};
    return buildGroups(this.hass, this._config, this._getIndex());
  }

  private _sortedEntities(group: Group): string[] {
    return [...group.entities].sort(
      (a, b) =>
        Number(group.active.includes(b)) - Number(group.active.includes(a)) ||
        this._entityName(this.hass!.states[a]).localeCompare(this._entityName(this.hass!.states[b]))
    );
  }

  private _helpers?: CardHelpers;

  /** HA's card helpers (for native tiles); undefined when they are not available. */
  private async _loadHelpers(): Promise<CardHelpers | undefined> {
    try {
      return (await (window as unknown as { loadCardHelpers?: () => Promise<CardHelpers> }).loadCardHelpers?.()) ?? undefined;
    } catch {
      return undefined;
    }
  }

  private async _openPopup(id: GroupId) {
    const group = this._currentGroups()[id];
    if (!group) return;
    this._popup = id;
    this._room = false;
    this._tiles = undefined;
    const helpers = await this._loadHelpers();
    if (this._popup !== id) return;
    if (!helpers) {
      this._tiles = null;
      return;
    }
    const tiles = await Promise.all(this._sortedEntities(group).map((entity) => this._createTile(helpers, entity)));
    if (this._popup === id) this._tiles = tiles;
  }

  /** What each native popup tile was built from, so it can be re-configured when its state changes. */
  private _tileSources = new WeakMap<HTMLElement, { entity: string; name: string; state?: HassEntity; key: string }>();

  /** A native tile for the popups (config from `tileConfig`), remembered for `_syncTile`. */
  private async _createTile(helpers: CardHelpers, entity: string, name?: string): Promise<HTMLElement> {
    const s = this.hass!.states[entity];
    const label = name ?? this._entityName(s);
    const config = tileConfig(entity, s, label);
    const el = await helpers.createCardElement(config);
    this._tileSources.set(el, { entity, name: label, state: s, key: JSON.stringify(config) });
    (el as unknown as { hass?: HomeAssistant }).hass = this.hass;
    return el;
  }

  /**
   * Keep a tile's config in step with its state: a light that turns on gets its brightness slider, a scene
   * that has just run gets its "last run" line. Only re-applied when the config really changes.
   */
  private _syncTile(el: HTMLElement, hass: HomeAssistant) {
    const src = this._tileSources.get(el);
    const s = hass.states[src?.entity ?? ""];
    if (src && s !== src.state) {
      src.state = s;
      const config = tileConfig(src.entity, s, src.name);
      const key = JSON.stringify(config);
      const tile = el as unknown as { setConfig?: (c: Record<string, unknown>) => void };
      if (key !== src.key && tile.setConfig) {
        src.key = key;
        try {
          tile.setConfig(config);
        } catch {
          // Keep the tile as it was; HA shows its own error card for a config it rejects.
        }
      }
    }
    (el as unknown as { hass: HomeAssistant }).hass = hass;
  }

  private _closePopup() {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog.apc-popup")?.close();
  }

  private _onPopupClosed() {
    this._popup = undefined;
    this._tiles = undefined;
    this._room = false;
    this._roomTiles = undefined;
    this._roomModel = undefined;
  }

  private _onPopupClick(ev: MouseEvent) {
    // Clicks on the backdrop land on the <dialog> element itself.
    if (ev.target === ev.currentTarget) this._closePopup();
  }

  /** A tile asked for more-info: step aside so HA's dialog is on top, come back when it closes. */
  private _onPopupMoreInfo() {
    if (this._room) {
      this._roomScroll = this.renderRoot.querySelector<HTMLElement>(".room-body")?.scrollTop ?? 0;
      this._reopen = "room";
    } else {
      this._reopen = this._popup;
    }
    this._closePopup();
  }

  protected updated(): void {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.apc-popup");
    if (dialog && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute("open", "");
      }
      if (this._room && this._roomScroll) {
        const body = dialog.querySelector<HTMLElement>(".room-body");
        if (body) body.scrollTop = this._roomScroll;
        this._roomScroll = 0;
      }
    }
  }

  private _bulkActions(group: Group): { label: string; icon: string; service: string }[] {
    const any = group.active.length > 0;
    const t = (k: string) => localize(this.hass, k);
    switch (group.id) {
      case "lights":
        return [any
          ? { label: t("turn_all_off"), icon: "mdi:lightbulb-group-off-outline", service: "light.turn_off" }
          : { label: t("turn_all_on"), icon: "mdi:lightbulb-group", service: "light.turn_on" }];
      case "switches":
        return [any
          ? { label: t("turn_all_off"), icon: "mdi:power-plug-off-outline", service: "switch.turn_off" }
          : { label: t("turn_all_on"), icon: "mdi:power-plug-outline", service: "switch.turn_on" }];
      case "fans":
        return [any
          ? { label: t("turn_all_off"), icon: "mdi:fan-off", service: "fan.turn_off" }
          : { label: t("turn_all_on"), icon: "mdi:fan", service: "fan.turn_on" }];
      case "covers":
        return [
          { label: t("open_all"), icon: "mdi:arrow-up", service: "cover.open_cover" },
          { label: t("close_all"), icon: "mdi:arrow-down", service: "cover.close_cover" },
        ];
      case "media":
        return any ? [{ label: t("pause_all"), icon: "mdi:pause", service: "media_player.media_pause" }] : [];
      default:
        return [];
    }
  }

  private _bulk(group: Group, service: string) {
    this._fireAction(
      {
        tap_action: { action: "perform-action", perform_action: service, target: { entity_id: [...group.entities] } },
      },
      "tap"
    );
  }

  private _renderPopup(group: Group, area: AreaRegistryEntry) {
    const hass = this.hass!;
    const meta = GROUP_META[group.id];
    const active = group.active.length > 0;
    const title = group.id === "alerts" ? localize(hass, "g_alerts") : localize(hass, `g_${group.id}`);
    const sub = `${this._config!.name || area.name} · ${localize(hass, "n_of_m_active", {
      n: group.active.length,
      m: group.entities.length,
    })}`;
    return html`
      <dialog
        class="apc-popup"
        aria-label=${title}
        style=${styleMap({ "--c": meta.color })}
        @close=${this._onPopupClosed}
        @click=${this._onPopupClick}
        @hass-more-info=${this._onPopupMoreInfo}
      >
        <div class="popup-surface">
          <header class="popup-head">
            <div class=${classMap({ "popup-icon": true, active })}>
              <ha-icon .icon=${active ? meta.icon : meta.iconOff}></ha-icon>
            </div>
            <div class="popup-titles">
              <div class="popup-title">${title}</div>
              <div class="popup-sub">${sub}</div>
            </div>
            <button class="popup-close" aria-label=${localize(hass, "close")} @click=${() => this._closePopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          ${this._bulkActions(group).length
            ? html`<div class="popup-bulk">
                ${this._bulkActions(group).map(
                  (b) => html`<button class=${classMap({ bulk: true, calm: this._calmChips })} @click=${() => this._bulk(group, b.service)}>
                    <ha-icon .icon=${b.icon}></ha-icon>${b.label}
                  </button>`
                )}
              </div>`
            : nothing}
          <div class="popup-grid">
            ${this._tiles === undefined
              ? nothing
              : this._tiles === null
              ? this._sortedEntities(group).map((id) => this._fallbackTile(id, group))
              : this._tiles}
          </div>
        </div>
      </dialog>
    `;
  }

  /** Tile look-alike used when HA's card helpers can't be loaded, and for compact status rows. */
  private _fallbackTile(id: string, group: Group) {
    return this._miniTile(id, { color: GROUP_META[group.id].color, active: group.active.includes(id) });
  }

  private _miniTile(id: string, opts: { color: string; active: boolean; name?: string; sub?: string }) {
    const hass = this.hass!;
    const s = hass.states[id];
    if (!s) return nothing;
    const rgb = id.startsWith("light.") ? lightColor(s) : undefined;
    const color = rgb ? `rgb(${rgb.join(",")})` : opts.color;
    const t = Date.parse(s.last_changed);
    const domain = id.split(".")[0];
    const toggleable = ["light", "switch", "fan", "input_boolean", "cover", "media_player", "lock"].includes(domain);
    // Same rules as the native tile (`tileConfig`): a scene, script or button runs on tap and shows when it
    // last ran, or nothing.
    const run = RUNNABLE_SERVICE[domain];
    const stateLine = opts.sub ?? (run ? this._lastRun(s) : `${this._formatState(s)}${Number.isNaN(t) ? "" : ` · ${this._ago(t)}`}`);
    return html`
      <div
        class=${classMap({ "mini-tile": true, active: opts.active })}
        style=${styleMap({ "--c": color })}
        role="button"
        tabindex="0"
        ${actionHandler({ hasHold: true })}
        @apc-action=${(ev: CustomEvent) => {
          if (ev.detail.action === "hold" || (!toggleable && !run)) this._moreInfo(id);
          else if (run)
            this._fireAction(
              { tap_action: { action: "perform-action", perform_action: run, target: { entity_id: id } } },
              "tap"
            );
          else this._fireAction({ entity: id, tap_action: { action: "toggle" } }, "tap");
        }}
      >
        <div class="mt-icon"><ha-state-icon .hass=${hass} .stateObj=${s}></ha-state-icon></div>
        <div class="mt-text">
          <div class="mt-name" title=${this._entityName(s)}>${opts.name ?? this._entityName(s)}</div>
          <div class="mt-state">${stateLine}</div>
        </div>
      </div>
    `;
  }

  /** "Last run: 5 min" for a scene, script or button; empty when it never ran (instead of "Unknown"). */
  private _lastRun(s: HassEntity): string {
    if (s.state === "unavailable") return this._formatState(s);
    const when = s.entity_id.startsWith("script.") ? (s.attributes.last_triggered as string | undefined) : s.state;
    const t = when ? Date.parse(when) : NaN;
    return Number.isNaN(t) ? "" : localize(this.hass, "last_run", { ago: this._ago(t) });
  }

  // ---- Room popup ---------------------------------------------------------

  private _roomEnabled(index: AreaIndex): boolean {
    return this._config?.room_popup !== false && index.primary.length > 0;
  }

  private async _openRoom(restore = false) {
    const { hass, _config: config } = this;
    if (!hass || !config) return;
    if (!restore) this._roomUi = { query: "", collapsed: new Set(), expanded: new Set() };
    const model = buildRoom(hass, config, this._getIndex());
    const ids = (kind: RoomSection["kind"]) => model.sections.filter((x) => x.kind === kind).flatMap((x) => x.entities);
    this._roomModel = model;
    this._roomLabels = roomLabels(hass, config.area, ids("stats"), [...ids("tiles"), ...ids("status")]);
    this._popup = undefined;
    this._tiles = undefined;
    this._roomTiles = undefined;
    this._room = true;

    this._helpers = await this._loadHelpers();
    if (!this._room || this._roomModel !== model) return;
    if (!this._helpers) {
      this._roomTiles = null;
      return;
    }
    this._roomTiles = new Map();
    await this._ensureRoomTiles();
  }

  private _roomName(id: string): string {
    return this._roomLabels[id]?.name ?? this._entityName(this.hass?.states[id]);
  }

  private _roomMatches(id: string): boolean {
    const q = this._roomUi.query;
    if (!q.trim()) return true;
    const s = this.hass?.states[id];
    return matchesQuery(q, this._roomName(id), s?.attributes.friendly_name as string | undefined, id, this._roomLabels[id]?.sub);
  }

  /** How many rows a section shows before "Show N more". */
  private static readonly ROOM_LIMIT = 8;

  private _roomVisible(sec: RoomSection): string[] {
    if (this._roomUi.query.trim()) return sec.entities.filter((id) => this._roomMatches(id));
    if (this._roomUi.expanded.has(sec.id)) return sec.entities;
    return sec.entities.slice(0, AreaPulseCard.ROOM_LIMIT);
  }

  /** Create the native tiles that are on screen and do not exist yet. Hundreds of entities stay cheap. */
  private async _ensureRoomTiles() {
    const tiles = this._roomTiles;
    const helpers = this._helpers;
    if (!tiles || !helpers || !this._roomModel || !this.hass) return;
    const searching = !!this._roomUi.query.trim();
    const need: string[] = [];
    for (const sec of this._roomModel.sections) {
      if (sec.kind !== "tiles" || (!searching && this._roomUi.collapsed.has(sec.id))) continue;
      for (const id of this._roomVisible(sec)) if (!tiles.has(id)) need.push(id);
    }
    if (!need.length) return;
    const created = await Promise.all(
      need.map(async (id) => [id, await this._createTile(helpers, id, this._roomName(id))] as const)
    );
    if (this._roomTiles !== tiles) return; // closed or reopened meanwhile
    for (const [id, el] of created) if (!tiles.has(id)) tiles.set(id, el);
    this.requestUpdate();
  }

  private _updateRoomUi(patch: Partial<AreaPulseCard["_roomUi"]>) {
    this._roomUi = { ...this._roomUi, ...patch };
    void this._ensureRoomTiles();
  }

  private _toggleIn(set: Set<string>, id: string): Set<string> {
    const next = new Set(set);
    if (!next.delete(id)) next.add(id);
    return next;
  }

  /** Section colour; with `chip_colors: state` the header icon is neutral, except red for "needs attention". */
  private _sectionStyle(id: RoomSection["id"], color: string): Record<string, string> {
    const style: Record<string, string> = { "--c": color };
    if (this._calmChips) style["--apc-sec-icon"] = id === "attention" ? "var(--apc-red)" : "var(--secondary-text-color)";
    return style;
  }

  private _sectionMeta(id: RoomSection["id"]): { icon: string; color: string; title: string } {
    const t = (k: string) => localize(this.hass, k);
    switch (id) {
      case "attention":
        return { icon: "mdi:alert-circle-outline", color: "var(--apc-red)", title: t("room_attention") };
      case "status":
        return { icon: "mdi:motion-sensor", color: "var(--apc-green)", title: t("room_status") };
      case "sensors":
        return { icon: "mdi:gauge", color: "var(--apc-blue)", title: t("room_sensors") };
      case "other":
        return { icon: "mdi:dots-grid", color: "var(--apc-accent)", title: t("room_other") };
      default: {
        const meta = GROUP_META[id as GroupId];
        return { icon: meta.icon, color: meta.color, title: t(`g_${id}`) };
      }
    }
  }

  private _statusColor(id: string, reason?: string): string {
    if (reason === "alert") return "var(--apc-red)";
    if (reason === "battery") return "var(--apc-orange)";
    if (reason === "unavailable") return "var(--secondary-text-color)";
    switch (this.hass?.states[id]?.attributes.device_class) {
      case "motion":
      case "occupancy":
      case "presence":
        return "var(--apc-green)";
      case "door":
      case "garage_door":
      case "window":
      case "opening":
        return "var(--apc-orange)";
      default:
        return "var(--apc-accent)";
    }
  }

  private _renderRoom(
    area: AreaRegistryEntry,
    groups: Partial<Record<GroupId, Group>>,
    temperature?: Reading,
    humidity?: Reading
  ) {
    const hass = this.hass!;
    const config = this._config!;
    const model = this._roomModel;
    if (!model) return nothing;
    const ui = this._roomUi;
    const searching = !!ui.query.trim();
    const name = config.name || area.name;

    const mainLight = findMainLight(hass, config, this._getIndex());
    const rgb = mainLight ? lightColor(hass.states[mainLight]) : undefined;
    const sections = model.sections.map((sec) => this._renderRoomSection(sec, groups)).filter((x) => x !== nothing);

    return html`
      <dialog
        class="apc-popup room"
        aria-label=${name}
        style=${styleMap(rgb ? { "--room-rgb": rgb.join(",") } : {})}
        @close=${this._onPopupClosed}
        @click=${this._onPopupClick}
        @hass-more-info=${this._onPopupMoreInfo}
      >
        <div class="popup-surface room-surface">
          <div class="sheet-handle" aria-hidden="true"></div>
          <header class="room-head">
            <div class=${classMap({ "room-icon": true, "light-on": !!rgb })}>
              <ha-icon .icon=${config.icon || area.icon || DEFAULT_ICON}></ha-icon>
            </div>
            <div class="popup-titles">
              <div class="popup-title">${name}</div>
              <div class="popup-sub">${this._secondary(groups)}</div>
            </div>
            ${this._renderClimate(temperature, humidity)}
            <button class="popup-close" aria-label=${localize(hass, "close")} @click=${() => this._closePopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          ${model.total > 12
            ? html`<div class="room-search">
                <ha-icon icon="mdi:magnify"></ha-icon>
                <input
                  type="search"
                  enterkeyhint="search"
                  autocomplete="off"
                  spellcheck="false"
                  placeholder=${localize(hass, "room_search")}
                  aria-label=${localize(hass, "room_search")}
                  .value=${ui.query}
                  @input=${(ev: Event) => this._updateRoomUi({ query: (ev.target as HTMLInputElement).value })}
                />
                ${searching
                  ? html`<button
                      class="search-clear"
                      aria-label=${localize(hass, "room_clear_search")}
                      @click=${() => this._updateRoomUi({ query: "" })}
                    >
                      <ha-icon icon="mdi:close-circle"></ha-icon>
                    </button>`
                  : nothing}
              </div>`
            : nothing}
          <div class="room-body">
            ${sections.length
              ? sections
              : html`<div class="room-empty">
                  ${searching
                    ? localize(hass, "room_no_results", { q: ui.query.trim() })
                    : localize(hass, "room_empty")}
                </div>`}
          </div>
        </div>
      </dialog>
    `;
  }

  private _renderRoomSection(sec: RoomSection, groups: Partial<Record<GroupId, Group>>) {
    const hass = this.hass!;
    const ui = this._roomUi;
    const searching = !!ui.query.trim();
    const visible = this._roomVisible(sec);
    if (searching && !visible.length) return nothing;

    const meta = this._sectionMeta(sec.id);
    const collapsed = !searching && ui.collapsed.has(sec.id);
    const total = sec.entities.length;
    const activeN = sec.entities.filter((id) => isActiveState(hass.states[id])).length;
    const count = searching
      ? String(visible.length)
      : sec.kind === "tiles" || sec.kind === "status"
        ? sec.id !== "attention" && activeN > 0
          ? localize(hass, "n_of_m_active", { n: activeN, m: total })
          : String(total)
        : String(total);
    const group = groups[sec.id as GroupId];
    const bulk = group && sec.kind === "tiles" && !collapsed ? this._bulkActions(group) : [];
    const overflow = total > AreaPulseCard.ROOM_LIMIT && !searching;
    const expanded = ui.expanded.has(sec.id);

    return html`
      <section class="room-sec" style=${styleMap(this._sectionStyle(sec.id, meta.color))} data-section=${sec.id}>
        <div class="sec-head">
          <button
            class="sec-toggle"
            aria-expanded=${String(!collapsed)}
            @click=${() => this._updateRoomUi({ collapsed: this._toggleIn(ui.collapsed, sec.id) })}
          >
            <ha-icon class="sec-icon" .icon=${meta.icon}></ha-icon>
            <span class="sec-title">${meta.title}</span>
            <span class="sec-count">${count}</span>
            <ha-icon class="sec-chevron" .icon=${collapsed ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
          </button>
          ${bulk.map(
            (b) => html`<button
              class=${classMap({ bulk: true, small: true, calm: this._calmChips })}
              @click=${() => this._bulk(group!, b.service)}
            >
              <ha-icon .icon=${b.icon}></ha-icon>${b.label}
            </button>`
          )}
        </div>
        ${collapsed
          ? nothing
          : html`<div class=${`sec-grid ${sec.kind}`}>${visible.map((id) => this._renderRoomItem(sec, id))}</div>
              ${overflow
                ? html`<button
                    class="sec-more"
                    @click=${() => this._updateRoomUi({ expanded: this._toggleIn(ui.expanded, sec.id) })}
                  >
                    ${expanded
                      ? localize(hass, "room_show_less")
                      : localize(hass, "room_show_more", { n: total - AreaPulseCard.ROOM_LIMIT })}
                  </button>`
                : nothing}`}
      </section>
    `;
  }

  private _renderRoomItem(sec: RoomSection, id: string) {
    const hass = this.hass!;
    const s = hass.states[id];
    if (!s) return nothing;
    const name = this._roomName(id);

    if (sec.kind === "stats") return this._statCell(id);

    if (sec.kind === "status") {
      const reason = sec.reasons?.[id];
      let sub: string | undefined;
      if (reason === "battery") sub = `${localize(hass, "reason_low_battery")} · ${this._formatState(s)}`;
      else if (reason === "unavailable") sub = localize(hass, "reason_unavailable");
      return this._miniTile(id, {
        color: this._statusColor(id, reason),
        active: reason ? reason !== "unavailable" : isActiveState(s),
        name,
        sub,
      });
    }

    // Controls: native tile when HA's helpers are there, look-alike otherwise.
    const tiles = this._roomTiles;
    const tile = tiles?.get(id);
    if (tile) return tile;
    if (tiles === null) {
      const meta = GROUP_META[sec.id as GroupId];
      return this._miniTile(id, { color: meta?.color ?? "var(--apc-accent)", active: isActiveState(s), name });
    }
    return html`<div class="tile-skel" aria-hidden="true"></div>`;
  }

  /** Dense read-only cell for a sensor: the value is the point, the name is the caption. */
  private _statCell(id: string) {
    const hass = this.hass!;
    const s = hass.states[id];
    const label = this._roomLabels[id] ?? { name: this._entityName(s) };
    const config = this._config!;
    const value = Number(s.state);
    const numeric = s.state.trim() !== "" && !Number.isNaN(value);
    const dc = s.attributes.device_class as string | undefined;
    let tone = "";
    if (numeric && dc === "temperature") {
      const unit = String(s.attributes.unit_of_measurement ?? "");
      const c = comfortState(value, config.comfort_temperature, unit.includes("F") ? [68, 76] : [19, 25]);
      tone = c === "ok" ? "" : `t-${c}`;
    } else if (numeric && dc === "humidity") {
      const c = comfortState(value, config.comfort_humidity, [35, 65]);
      tone = c === "ok" ? "" : `h-${c}`;
    } else if (numeric && dc === "carbon_dioxide") {
      tone = value >= 1500 ? "bad" : value >= 1000 ? "warn" : "";
    } else if (numeric && dc === "pm25") {
      tone = value >= 35 ? "bad" : value >= 12 ? "warn" : "";
    }
    return html`
      <button
        class=${classMap({ "stat-cell": true, [tone]: !!tone })}
        title=${(s.attributes.friendly_name as string | undefined) ?? id}
        @click=${() => this._moreInfo(id)}
      >
        <span class="sc-label">
          <ha-state-icon .hass=${hass} .stateObj=${s}></ha-state-icon>
          <span class="sc-name">${label.name}</span>
        </span>
        <span class="sc-value">${this._formatState(s)}</span>
        ${label.sub ? html`<span class="sc-sub">${label.sub}</span>` : nothing}
      </button>
    `;
  }

  // ---- Formatting ---------------------------------------------------------

  private _lang() {
    return this.hass?.locale?.language || this.hass?.language || "en";
  }

  private _num(v: number, digits: number) {
    return new Intl.NumberFormat(this._lang(), { maximumFractionDigits: digits }).format(v);
  }

  private _lastChange(ids: string[]): number | undefined {
    let latest: number | undefined;
    for (const id of ids) {
      const t = Date.parse(this.hass!.states[id]?.last_changed ?? "");
      if (!Number.isNaN(t) && (latest === undefined || t > latest)) latest = t;
    }
    return latest;
  }

  private _ago(ts: number): string {
    const sec = Math.max(0, (Date.now() - ts) / 1000);
    const lang = this._lang();
    const fmt = (value: number, unit: string) =>
      new Intl.NumberFormat(lang, { style: "unit", unit, unitDisplay: "short" }).format(value);
    if (sec < 60) return localize(this.hass, "since_now");
    if (sec < 3600) return fmt(Math.floor(sec / 60), "minute");
    if (sec < 86400) return fmt(Math.floor(sec / 3600), "hour");
    return fmt(Math.floor(sec / 86400), "day");
  }

  private _formatState(s: HassEntity): string {
    try {
      return this.hass?.formatEntityState?.(s) ?? s.state;
    } catch {
      return s.state;
    }
  }

  private _entityName(s?: HassEntity): string {
    if (!s) return "";
    const full = (s.attributes.friendly_name as string | undefined) ?? s.entity_id;
    const areaName = this.hass?.areas?.[this._config!.area]?.name;
    if (areaName && full.toLowerCase().startsWith(areaName.toLowerCase() + " ")) {
      const rest = full.slice(areaName.length + 1).trim();
      return rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : full;
    }
    return full;
  }
}

if (!customElements.get("area-pulse-card")) {
  customElements.define("area-pulse-card", AreaPulseCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "area-pulse-card",
    name: "Area Pulse Card",
    description: "Presence, climate, openings, alerts and quick actions for an area.",
    preview: true,
  });
}
