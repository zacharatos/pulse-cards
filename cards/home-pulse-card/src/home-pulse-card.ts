import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import type {
  ActionConfig,
  AlarmMode,
  ChipConfig,
  HassEntity,
  HomeAssistant,
  HomePulseCardConfig,
  PulseId,
  SectionId,
  ShortcutConfig,
} from "./types";
import {
  alarmView,
  badgeTone,
  balanceRows,
  byArea,
  cssColor,
  DEFAULT_SECTIONS,
  discoverOne,
  discoverPersons,
  firstName,
  greetingKey,
  indexHome,
  isHome,
  isNight,
  NUDGE_GROUPS,
  nudges,
  pulseGroups,
  pulseTone,
  SECTION_IDS,
  shortcutActive,
  shortcutBadge,
  shortcutTapAction,
  watchedEntities,
  weatherIcon,
  weatherTemp,
  type AlarmButton,
  type GreetingKey,
  type HomeIndex,
  type Nudge,
  type PulseGroup,
  type PulseTone,
} from "./home";
import { forecastType, todayRange, type ForecastItem } from "./weather";
import { discoverModeEntity, modeEntities, resolveModes, type ResolvedMode } from "./modes";
import { formatTodayItem, todayCalendars, todayEntities, todayItems } from "./today";
import { actionHandler, type ActionKind } from "./action-handler";
import { localize, relativeTime } from "./localize";
import { cardStyles } from "./styles";
import { popupStyles } from "./popup-styles";
import "./editor";


interface CardHelpers {
  createCardElement: (config: Record<string, unknown>) => HTMLElement | Promise<HTMLElement>;
}

/** Same icons as the Area Pulse Card group chips. */
const PULSE_META: Record<PulseId, { icon: string; iconOff: string; keys: [string, string, string] }> = {
  alerts: { icon: "mdi:alert", iconOff: "mdi:shield-check", keys: ["alert", "alerts_n", "alerts_none"] },
  lights: { icon: "mdi:lightbulb-on", iconOff: "mdi:lightbulb-outline", keys: ["light_on", "lights_on_n", "lights_off_all"] },
  doors: { icon: "mdi:door-open", iconOff: "mdi:door-closed", keys: ["door_open", "doors_open", "doors_closed"] },
  windows: { icon: "mdi:window-open-variant", iconOff: "mdi:window-closed-variant", keys: ["window_open", "windows_open", "windows_closed"] },
  covers: { icon: "mdi:window-shutter-open", iconOff: "mdi:window-shutter", keys: ["cover_open", "covers_open_n", "covers_closed"] },
  locks: { icon: "mdi:lock-open-variant", iconOff: "mdi:lock", keys: ["lock_unlocked", "lock_unlocked", "locks_locked"] },
  fans: { icon: "mdi:fan", iconOff: "mdi:fan-off", keys: ["fan_on", "fans_on_n", "fans_off_all"] },
  switches: { icon: "mdi:power-socket-eu", iconOff: "mdi:power-plug-off-outline", keys: ["switch_on", "switches_on_n", "switches_off_all"] },
  media: { icon: "mdi:play-circle", iconOff: "mdi:speaker", keys: ["media_playing_n", "media_playing_n", "media_idle"] },
  climate: { icon: "mdi:thermostat", iconOff: "mdi:thermostat", keys: ["climate_on", "climate_on_n", "climate_off"] },
  batteries: { icon: "mdi:battery-alert-variant-outline", iconOff: "mdi:battery", keys: ["battery_low", "batteries_low", "batteries_ok"] },
};

/** Colour only means state (the family rule): a problem, needs a look, lights on, or no colour at all. */
const TONE_COLOR: Record<PulseTone, string> = {
  "": "var(--secondary-text-color)",
  on: "var(--hpc-amber)",
  warn: "var(--hpc-orange)",
  bad: "var(--hpc-red)",
};

const ALARM_ICONS: Record<string, string> = {
  disarmed: "mdi:shield-off-outline",
  armed_home: "mdi:shield-home",
  armed_away: "mdi:shield-lock",
  armed_night: "mdi:shield-moon",
  armed_vacation: "mdi:shield-airplane",
  armed_custom_bypass: "mdi:shield-star",
  arming: "mdi:shield-sync",
  pending: "mdi:shield-sync",
  disarming: "mdi:shield-sync",
  triggered: "mdi:bell-ring",
};

const ALARM_BUTTON_ICONS: Record<AlarmMode | "disarm", string> = {
  arm_home: "mdi:shield-home",
  arm_away: "mdi:shield-lock",
  arm_night: "mdi:shield-moon",
  arm_vacation: "mdi:shield-airplane",
  arm_custom_bypass: "mdi:shield-star",
  disarm: "mdi:shield-off",
};

/** Sun in the gold, the moon in the night glow; rain, storms and snow in their meaning. The rest stays neutral. */
const WEATHER_COLORS: Record<string, string> = {
  sunny: "var(--hpc-sun)",
  partlycloudy: "var(--hpc-sun)",
  "clear-night": "var(--hpc-moon)",
  rainy: "var(--hpc-blue)",
  pouring: "var(--hpc-blue)",
  lightning: "var(--hpc-orange)",
  "lightning-rainy": "var(--hpc-orange)",
  snowy: "var(--hpc-cold)",
  "snowy-rainy": "var(--hpc-cold)",
  hail: "var(--hpc-cold)",
};
const weatherColor = (condition: string) => WEATHER_COLORS[condition] ?? "var(--secondary-text-color)";

/** Home Assistant's own state colours, with fallbacks for themes that don't define them. */
function alarmColor(stateName: string): string {
  const fallback =
    stateName === "triggered"
      ? "var(--hpc-red)"
      : ["arming", "pending", "disarming"].includes(stateName)
      ? "var(--hpc-orange)"
      : stateName.startsWith("armed")
      ? "var(--hpc-green)"
      : "var(--hpc-blue)";
  return `var(--state-alarm_control_panel-${stateName}-color, ${fallback})`;
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
  interface HTMLElementTagNameMap {
    "home-pulse-card": HomePulseCard;
  }
}

export class HomePulseCard extends LitElement {
  static styles = [cardStyles, popupStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ reflect: true }) layout: "default" | "compact" = "default";
  @property({ reflect: true }) appearance: "card" | "flat" = "card";
  @state() protected _config?: HomePulseCardConfig;
  /** Pulse group shown in the popup. */
  @state() private _popup?: PulseId;
  /** Native tiles for the popup; null means HA's card helpers are unavailable and fallback tiles are drawn. */
  @state() private _tiles?: Map<string, HTMLElement> | null;
  private _popupEntities: string[] = [];
  private _reopen?: PulseId;
  private _onDialogClosed = () => {
    if (this._reopen) {
      const id = this._reopen;
      this._reopen = undefined;
      this._openPopup(id);
    }
  };

  private _index?: HomeIndex;
  private _indexDeps: unknown[] = [];
  private _persons: string[] = [];
  private _weather?: string;
  private _alarm?: string;
  private _modeEntity?: string;
  private _calendars: string[] = [];
  private _watched = new Set<string>();
  private _ticker?: number;
  /** Today's forecast for the weather entity, from HA's forecast subscription. */
  private _forecast?: ForecastItem[];
  private _forecastFor?: string;
  private _forecastUnsub?: Promise<(() => void) | undefined>;

  // ---- Lovelace API -------------------------------------------------------

  static getConfigElement() {
    return document.createElement("home-pulse-card-editor");
  }

  /** Zero config: everything is discovered. Shortcuts have their own card (Home Pulse Shortcuts). */
  static getStubConfig(): Partial<HomePulseCardConfig> {
    return {};
  }

  setConfig(config: HomePulseCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    for (const key of ["shortcuts", "chips", "persons", "sections", "pulse", "alarm_modes", "exclude_entities"] as const) {
      if (config[key] !== undefined && !Array.isArray(config[key])) throw new Error(`\`${key}\` must be a list`);
    }
    for (const c of config.chips ?? []) {
      if (!c || typeof c !== "object" || !c.entity) throw new Error("Every item in `chips` needs an `entity`");
    }
    const unknown = (config.sections ?? []).filter((s) => !SECTION_IDS.includes(s));
    if (unknown.length) throw new Error(`Unknown section(s): ${unknown.join(", ")}. Use ${SECTION_IDS.join(", ")}.`);
    this._config = { ...config };
    this.layout = config.layout === "compact" ? "compact" : "default";
    this.appearance = config.appearance === "flat" ? "flat" : "card";
    this._popup = undefined;
    this._indexDeps = [];
  }

  getCardSize(): number {
    const sections = this._config?.sections ?? DEFAULT_SECTIONS;
    return Math.max(1, sections.length + (this.layout === "compact" ? 0 : 1));
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" as const };
  }

  // ---- Lifecycle ----------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    // Greeting, date and "3 days ago" change with time, not with states.
    this._ticker = window.setInterval(() => this.requestUpdate(), 60_000);
    window.addEventListener("dialog-closed", this._onDialogClosed);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._ticker) window.clearInterval(this._ticker);
    window.removeEventListener("dialog-closed", this._onDialogClosed);
    this._unsubscribeForecast();
  }

  /** Follow the weather entity's forecast while the card shows the weather; one subscription at a time. */
  private _syncForecast() {
    const hass = this.hass;
    const sections = this._config?.sections ?? DEFAULT_SECTIONS;
    const shown = sections.includes("greeting") || sections.includes("status");
    const entity = shown && this.isConnected ? this._weather : undefined;
    const type = entity ? forecastType(hass?.states[entity]) : undefined;
    const key = entity && type ? `${entity}|${type}` : undefined;
    if (key === this._forecastFor) return;
    this._unsubscribeForecast();
    if (!key || !hass?.connection) return;
    this._forecastFor = key;
    this._forecastUnsub = hass.connection
      .subscribeMessage<{ forecast?: ForecastItem[] }>(
        (msg) => {
          this._forecast = Array.isArray(msg?.forecast) ? msg.forecast : undefined;
          this.requestUpdate();
        },
        { type: "weather/subscribe_forecast", forecast_type: type, entity_id: entity }
      )
      .catch(() => undefined); // an integration without forecasts just shows no range
  }

  private _unsubscribeForecast() {
    this._forecastUnsub?.then((unsub) => unsub?.());
    this._forecastUnsub = undefined;
    this._forecastFor = undefined;
    this._forecast = undefined;
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    if (changed.has("hass") && this.hass) {
      for (const t of this._tiles?.values() ?? []) (t as unknown as { hass: HomeAssistant }).hass = this.hass;
    }
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    const hass = this.hass;
    if (!old || !hass) return true;
    if (
      old.entities !== hass.entities ||
      old.devices !== hass.devices ||
      old.areas !== hass.areas ||
      old.user !== hass.user ||
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
    // The registry is what decides membership; states only change values. A brand-new entity
    // usually arrives with a registry update, so this stays cheap in big homes.
    const deps = [hass.entities, hass.devices, config];
    if (!this._index || deps.some((d, i) => d !== this._indexDeps[i])) {
      // Discover (and watch) only what a shown block uses, so the shortcuts card stays as light as it looks.
      const sections = config.sections ?? DEFAULT_SECTIONS;
      const uses = (...ids: SectionId[]) => ids.some((id) => sections.includes(id));
      this._index = indexHome(hass, config);
      this._persons = uses("status", "nudges") ? discoverPersons(hass, config) : [];
      this._weather = uses("greeting", "status") ? discoverOne(hass, "weather", config.weather_entity) : undefined;
      this._alarm = uses("status", "alarm", "nudges") ? discoverOne(hass, "alarm_control_panel", config.alarm_entity) : undefined;
      this._modeEntity = uses("modes") ? discoverModeEntity(hass, config) : undefined;
      this._calendars = uses("greeting") ? todayCalendars(hass, config) : [];
      this._watched = watchedEntities(config, this._index, this._persons, [
        this._weather,
        this._alarm,
        this._showGlow ? "sun.sun" : undefined,
        ...(uses("modes") ? modeEntities(hass, { ...config, mode_entity: this._modeEntity ?? "none" }) : []),
        ...this._calendars,
        ...(uses("greeting") ? todayEntities(config).map((e) => e.entity) : []),
      ]);
      this._indexDeps = deps;
    }
  }

  /** The sun/moon corner glow belongs to the overview's sky; the shortcuts card has none. */
  protected get _showGlow(): boolean {
    return true;
  }

  protected updated(): void {
    this._syncForecast();
    this._checkStatusOverflow();
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.hpc-popup");
    if (dialog && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute("open", "");
      }
    }
  }

  /** Fade the right edge of the people/weather row only while there is more to scroll to. */
  private _checkStatusOverflow = () => {
    const row = this.renderRoot.querySelector<HTMLElement>(".status");
    if (!row) return;
    row.classList.toggle("overflow", row.scrollLeft + row.clientWidth < row.scrollWidth - 4);
  };

  // ---- Render -------------------------------------------------------------

  protected render() {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return nothing;
    const index = this._index ?? indexHome(hass, config);
    const sections = (config.sections ?? DEFAULT_SECTIONS).filter((s) => SECTION_IDS.includes(s));
    // Weather sits beside the greeting; without a greeting it joins the status row.
    const weatherInGreeting = sections.includes("greeting");
    // The alarm is a quiet chip in the status row unless the full alarm block is shown.
    const alarmChip = !sections.includes("alarm");
    const groups = sections.includes("pulse") ? pulseGroups(hass, config, index) : [];
    const night = isNight(hass.states["sun.sun"], new Date().getHours());

    const blocks: Record<SectionId, () => TemplateResult | typeof nothing> = {
      greeting: () => this._renderGreeting(greetingKey(new Date().getHours())),
      status: () => this._renderStatus(!weatherInGreeting, alarmChip),
      alerts: () => this._renderAlerts(index),
      nudges: () => this._renderNudgeBlock(index),
      modes: () => this._renderModes(),
      alarm: () => this._renderAlarm(),
      pulse: () => this._renderPulse(groups),
      shortcuts: () => this._renderShortcuts(index),
    };

    return html`
      <ha-card class=${night ? "night" : "day"}>
        ${this._showGlow ? html`<div class="glow"></div>` : nothing}
        <div class="content">${sections.map((s) => blocks[s]())}</div>
      </ha-card>
      ${this._popup
        ? this._renderPopup(
            pulseGroups(hass, { ...config, pulse: [this._popup] }, index)[0] ?? this._groupFromIndex(this._popup, index)
          )
        : nothing}
    `;
  }

  private _t = (key: string, vars?: Record<string, string | number>) => localize(this.hass, key, vars);

  private _renderGreeting(key: GreetingKey) {
    const config = this._config!;
    const name = firstName(this.hass!.user?.name);
    const greet = this._t(key);
    const title = config.title
      ? config.title.replace("{name}", name).replace("{greeting}", greet)
      : name
      ? this._t("greet_with_name", { greet, name })
      : greet;
    const date =
      config.show_date === false
        ? undefined
        : new Intl.DateTimeFormat(this.hass!.locale?.language || this.hass!.language || "en", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }).format(new Date());
    const weather = this._weather ? this.hass!.states[this._weather] : undefined;
    return html`
      <div class=${classMap({ greeting: true, center: !!config.center_greeting })}>
        <div class="hello-text">
          <h2 class="hello">${title}</h2>
          ${date ? html`<div class="date">${date}</div>` : nothing}
          ${this._renderToday()}
        </div>
        ${weather ? this._renderWeather(weather) : nothing}
      </div>
    `;
  }

  /** One quiet line: "Recycling tomorrow · Dentist 17:30". Nothing when there is nothing. */
  private _renderToday() {
    const hass = this.hass!;
    const config = this._config!;
    const items = todayItems(hass, config, new Date(), this._calendars);
    if (!items.length) return nothing;
    const lang = hass.locale?.language || hass.language || "en";
    // Follow the user's 12/24-hour setting in their HA profile ("language"/"system" = the locale's own).
    const tf = hass.locale?.time_format;
    const fmt = new Intl.DateTimeFormat(lang, {
      hour: "numeric",
      minute: "2-digit",
      ...(tf === "24" ? { hourCycle: "h23" as const } : tf === "12" ? { hourCycle: "h12" as const } : {}),
    });
    const time = (d: Date) => fmt.format(d);
    const text = items.map((i) => formatTodayItem(i, this._t, time)).join(" · ");
    const tap = (typeof config.today === "object" && config.today.tap_action) || { action: "more-info" as const };
    return html`
      <button
        class="today"
        title=${text}
        @click=${() => this._fireAction({ entity: items[0].entity, tap_action: tap }, "tap")}
      >
        <ha-icon icon="mdi:calendar-today-outline"></ha-icon><span class="today-text">${text}</span>
      </button>
    `;
  }

  /** House modes: a segmented row, the current mode lit in its colour. */
  private _renderModes() {
    const modes = resolveModes(this.hass!, { ...this._config!, mode_entity: this._modeEntity ?? "none" });
    if (!modes.length) return nothing;
    return html`
      <div class="modes" role="group">
        ${modes.map((m) => this._renderMode(m))}
      </div>
    `;
  }

  private _renderMode(m: ResolvedMode) {
    return html`
      <button
        class=${classMap({ mode: true, active: m.active })}
        style=${styleMap({ "--c": m.color ? cssColor(m.color) : "var(--hpc-accent)" })}
        aria-pressed=${String(m.active)}
        title=${m.name}
        ${actionHandler({ hasHold: !!m.hold_action })}
        @hpc-action=${(ev: CustomEvent<{ action: ActionKind }>) =>
          this._fireAction({ entity: m.entity, tap_action: m.tap_action, hold_action: m.hold_action }, ev.detail.action)}
      >
        <ha-icon .icon=${m.icon}></ha-icon>
        <span class="mode-name">${m.name}</span>
      </button>
    `;
  }

  private _renderStatus(withWeather: boolean, withAlarm: boolean) {
    const hass = this.hass!;
    const config = this._config!;
    const persons = this._persons.filter((p) => config.show_away !== false || isHome(hass.states[p]));
    const weather = withWeather && this._weather ? hass.states[this._weather] : undefined;
    const alarm = withAlarm && this._alarm ? hass.states[this._alarm] : undefined;
    const chips = config.chips ?? [];
    if (!persons.length && !weather && !alarm && !chips.length) return nothing;
    return html`
      <div class="status" @scroll=${this._checkStatusOverflow}>
        ${weather ? this._renderWeatherChip(weather) : nothing}
        ${alarm ? this._renderAlarmChip(alarm) : nothing}
        ${persons.map((p) => this._renderPerson(hass.states[p]))}
        ${chips.map((c) => this._renderExtraChip(c))}
      </div>
    `;
  }

  /** Large, quiet weather beside the greeting: icon and temperature, condition and today's high and low underneath. */
  private _renderWeather(s: HassEntity) {
    const temp = weatherTemp(s);
    const type = forecastType(s);
    const range = type && this._forecastFor?.startsWith(`${s.entity_id}|`) ? todayRange(this._forecast, type) : undefined;
    const rangeText = range
      ? range.low === undefined
        ? this._t("weather_high", { high: `${range.high}°` })
        : this._t("weather_range", { high: `${range.high}°`, low: `${range.low}°` })
      : "";
    return html`
      <button
        class="weather"
        title=${rangeText ? `${this._format(s)} · ${rangeText}` : this._format(s)}
        style=${styleMap({ "--c": weatherColor(s.state) })}
        @click=${() => this._moreInfo(s.entity_id)}
      >
        <span class="weather-main">
          <ha-icon .icon=${weatherIcon(s.state)}></ha-icon>${temp ? html`<span class="temp">${temp}</span>` : nothing}
        </span>
        <span class="weather-cond">${this._format(s)}</span>
        ${range
          ? html`<span class="weather-range" aria-label=${rangeText}>
              <span><ha-icon icon="mdi:arrow-up"></ha-icon>${range.high}°</span>
              ${range.low !== undefined ? html`<span><ha-icon icon="mdi:arrow-down"></ha-icon>${range.low}°</span>` : nothing}
            </span>`
          : nothing}
      </button>
    `;
  }

  private _renderWeatherChip(s: HassEntity) {
    const temp = weatherTemp(s);
    return html`
      <button class="chip colored" style=${styleMap({ "--c": weatherColor(s.state) })} @click=${() => this._moreInfo(s.entity_id)}>
        <ha-icon .icon=${weatherIcon(s.state)}></ha-icon>
        <span class="label">${temp ? html`${temp}<span class="muted"> · ${this._format(s)}</span>` : this._format(s)}</span>
      </button>
    `;
  }

  /** The alarm as one quiet chip: tap for HA's own alarm dialog (arm, disarm, keypad). */
  private _renderAlarmChip(s: HassEntity) {
    const view = alarmView(s, this._config!.alarm_modes);
    const label = this.hass!.formatEntityState?.(s) ?? this._t(`alarm_${s.state}`);
    const loud = view?.tone === "triggered" || view?.tone === "pending";
    return html`
      <button
        class=${classMap({ chip: true, colored: true, alarm: true, loud })}
        style=${styleMap({ "--c": alarmColor(s.state) })}
        @click=${() => this._moreInfo(s.entity_id)}
      >
        <ha-icon .icon=${ALARM_ICONS[s.state] ?? "mdi:shield-outline"}></ha-icon>
        <span class="label">${label}</span>
      </button>
    `;
  }

  /** Nothing at all until a safety sensor trips; then one red line. */
  private _renderAlerts(index: HomeIndex) {
    const hass = this.hass!;
    const active = index.alerts.filter((id) => hass.states[id]?.state === "on");
    if (!active.length) return nothing;
    return this._renderAlertBanner({ id: "alerts", entities: index.alerts, active });
  }

  private _renderPerson(s?: HassEntity) {
    if (!s) return nothing;
    const home = isHome(s);
    const name = firstName(String(s.attributes.friendly_name ?? s.entity_id.split(".")[1]));
    const pic = s.attributes.entity_picture as string | undefined;
    const where = home ? "" : s.state === "not_home" ? this._t("away") : this._format(s);
    return html`
      <button
        class=${classMap({ chip: true, person: true, home, away: !home })}
        title=${`${s.attributes.friendly_name ?? name}: ${home ? this._t("home") : where}`}
        @click=${() => this._moreInfo(s.entity_id)}
      >
        <span
          class=${classMap({ avatar: true, pic: !!pic })}
          style=${styleMap(pic ? { backgroundImage: `url("${pic}")` } : {})}
          >${pic ? nothing : name.charAt(0)}</span
        >
        <span class="label">${name}${where ? html`<span class="muted"> · ${where}</span>` : nothing}</span>
      </button>
    `;
  }

  private _renderExtraChip(c: ChipConfig) {
    const s = this.hass!.states[c.entity];
    if (!s) return nothing;
    const value = this._format(s);
    const color = c.color ? cssColor(c.color) : "var(--secondary-text-color)"; // colour only when asked for
    return html`
      <button
        class=${classMap({ chip: true, colored: !!c.color })}
        style=${styleMap({ "--c": color })}
        ${actionHandler({ hasHold: !!c.hold_action })}
        @hpc-action=${(ev: CustomEvent<{ action: ActionKind }>) =>
          this._fireAction(
            {
              entity: c.entity,
              tap_action: c.tap_action ?? { action: "more-info" },
              hold_action: c.hold_action,
            },
            ev.detail.action
          )}
      >
        ${c.icon
          ? html`<ha-icon .icon=${c.icon}></ha-icon>`
          : html`<ha-state-icon .hass=${this.hass} .stateObj=${s}></ha-state-icon>`}
        <span class="label">${c.name ? html`${c.name}<span class="muted"> · ${value}</span>` : value}</span>
      </button>
    `;
  }

  private _renderAlarm() {
    if (!this._alarm) return nothing;
    const s = this.hass!.states[this._alarm];
    const view = alarmView(s, this._config!.alarm_modes);
    if (!s || !view) return nothing;
    const label = this.hass!.formatEntityState?.(s) ?? this._t(`alarm_${s.state}`);
    return html`
      <div class=${classMap({ "alarm-row": true, [view.tone]: true })} style=${styleMap({ "--c": alarmColor(s.state) })}>
        <div
          class="alarm-main"
          role="button"
          tabindex="0"
          @click=${() => this._moreInfo(s.entity_id)}
          @keydown=${(ev: KeyboardEvent) => (ev.key === "Enter" || ev.key === " ") && this._moreInfo(s.entity_id)}
        >
          <div class="alarm-icon"><ha-icon .icon=${ALARM_ICONS[s.state] ?? "mdi:shield-outline"}></ha-icon></div>
          <div class="alarm-titles">
            <span class="alarm-state">${label}</span>
            <span class="alarm-sub">${relativeTime(this.hass, s.last_changed)}</span>
          </div>
        </div>
        <div class="alarm-buttons">${view.buttons.map((b) => this._renderAlarmButton(b, s.entity_id))}</div>
      </div>
    `;
  }

  private _renderAlarmButton(b: AlarmButton, entity: string) {
    const label = this._t(`alarm_btn_${b.mode}`);
    const target = b.mode === "disarm" ? "disarmed" : `armed_${b.mode.replace("arm_", "")}`;
    return html`
      <button
        class="alarm-btn"
        style=${styleMap({ "--b": alarmColor(target) })}
        title=${label}
        aria-label=${label}
        @click=${() =>
          b.needsCode
            ? this._moreInfo(entity) // HA's own keypad
            : this._fireAction(
                { tap_action: { action: "perform-action", perform_action: b.service, target: { entity_id: entity } } },
                "tap"
              )}
      >
        <ha-icon .icon=${ALARM_BUTTON_ICONS[b.mode]}></ha-icon><span class="label">${label}</span>
      </button>
    `;
  }

  private _renderPulse(groups: PulseGroup[]) {
    const config = this._config!;
    const hass = this.hass!;
    const chips = groups.filter((g) => g.active.length > 0 || config.show_inactive);
    const quiet = !chips.some((g) => g.active.length);
    return html`
      <div class="pulse">
        <div class="chips">
          ${quiet
            ? html`<span class="chip calm"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this._t("all_quiet")}</span>`
            : nothing}
          ${chips.map((g) => this._renderPulseChip(g))}
        </div>
      </div>
    `;
  }

  private _renderAlertBanner(g: PulseGroup) {
    const single = g.active.length === 1 ? this.hass!.states[g.active[0]] : undefined;
    const text = single ? String(single.attributes.friendly_name ?? single.entity_id) : this._t("alerts_n", { n: g.active.length });
    return html`
      <div class="banner alert" role="button" tabindex="0" @click=${() => this._groupClick(g)}>
        <ha-icon class="lead" icon="mdi:alert"></ha-icon>
        <span class="text">${text}</span>
      </div>
    `;
  }

  /** Nothing until everyone tracked is away and something was left on; then one banner. */
  private _renderNudgeBlock(index: HomeIndex) {
    if (this._config!.nudges === false) return nothing;
    const hass = this.hass!;
    const groups = pulseGroups(hass, { ...this._config!, pulse: NUDGE_GROUPS }, index);
    const hints: Nudge[] = nudges(hass, this._persons, groups, this._alarm);
    return hints.length ? this._renderNudges(hints) : nothing;
  }

  /** All "nobody is home" hints in one banner, each with its own fix. */
  private _renderNudges(list: Nudge[]) {
    const words: Record<Nudge["id"], [string, string]> = {
      away_doors: ["door_open", "doors_open"],
      away_windows: ["window_open", "windows_open"],
      away_locks: ["nudge_unlocked", "nudge_unlocked_n"],
      away_lights: ["light_on", "lights_on_n"],
      away_media: ["media_playing_n", "media_playing_n"],
      away_alarm: ["nudge_away_alarm", "nudge_away_alarm"],
    };
    const what = list.map((n) => this._t(words[n.id][n.n === 1 ? 0 : 1], { n: n.n }));
    const fixes: Record<Nudge["id"], { key: string; icon: string }> = {
      away_doors: { key: "nudge_fix_doors", icon: "mdi:door-open" },
      away_windows: { key: "nudge_fix_windows", icon: "mdi:window-open-variant" },
      away_locks: { key: "nudge_fix_locks", icon: "mdi:lock" },
      away_lights: { key: "nudge_fix_lights", icon: "mdi:lightbulb-group-off-outline" },
      away_media: { key: "nudge_fix_media", icon: "mdi:pause" },
      away_alarm: { key: "nudge_fix_alarm", icon: "mdi:shield-lock" },
    };
    return html`
      <div class="banner nudge">
        <ha-icon class="lead" icon="mdi:home-export-outline"></ha-icon>
        <div class="nudge-body">
          <div class="nudge-title">${this._t("nudge_nobody_home")}</div>
          <div class="nudge-what">${what.join(" · ")}</div>
          <div class="nudge-fixes">
            ${list.map(
              (n) => html`<button
                class="fix"
                @click=${() =>
                  n.popup
                    ? this._groupClick({ id: n.popup, entities: n.entities, active: n.entities })
                    : this._fireAction({ entity: n.entities[0], tap_action: n.action }, "tap")}
              >
                <ha-icon .icon=${fixes[n.id].icon}></ha-icon>${this._t(fixes[n.id].key)}
              </button>`
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _renderPulseChip(g: PulseGroup) {
    const meta = PULSE_META[g.id];
    const n = g.active.length;
    const label = this._t(n === 0 ? meta.keys[2] : n === 1 ? meta.keys[0] : meta.keys[1], { n });
    return html`
      <button
        class=${classMap({ chip: true, active: n > 0, idle: n === 0 })}
        style=${styleMap({ "--c": TONE_COLOR[pulseTone(g.id)] })}
        @click=${() => this._groupClick(g)}
      >
        <ha-icon .icon=${n ? meta.icon : meta.iconOff}></ha-icon>
        <span class="label">${label}</span>
      </button>
    `;
  }

  /** Popup colour: the group's tone, or the accent for groups whose state carries no colour. */
  private _groupColor(id: PulseId): string {
    const tone = pulseTone(id);
    return tone ? TONE_COLOR[tone] : "var(--hpc-accent)";
  }

  private _renderShortcuts(index: HomeIndex) {
    const config = this._config!;
    const shortcuts = config.shortcuts ?? [];
    if (!shortcuts.length) return nothing;
    const cols = Math.min(8, Math.max(1, Math.round(config.columns ?? 4)));
    let start = 0;
    return html`
      <div class="shortcuts">
        ${balanceRows(shortcuts.length, cols).map((size) => {
          const row = shortcuts.slice(start, (start += size));
          return html`<div class="shortcut-row">${row.map((sc) => this._renderShortcut(sc, index))}</div>`;
        })}
      </div>
    `;
  }

  private _renderShortcut(sc: ShortcutConfig, index: HomeIndex) {
    const hass = this.hass!;
    const badge = shortcutBadge(hass, sc, index, this._config!.battery_threshold ?? 20);
    const entityState = sc.entity ? hass.states[sc.entity] : undefined;
    const name = sc.name ?? (entityState ? String(entityState.attributes.friendly_name ?? "") : sc.navigation_path ?? "");
    const showName = this._config!.show_names !== false && !!name;
    return html`
      <button
        class=${classMap({ shortcut: true, active: shortcutActive(hass, sc), named: showName })}
        style=${styleMap({ "--c": sc.color ? cssColor(sc.color) : "var(--hpc-accent)" })}
        title=${name}
        aria-label=${badge ? `${name} (${badge})` : name}
        ${actionHandler({ hasHold: !!sc.hold_action, hasDoubleTap: !!sc.double_tap_action })}
        @hpc-action=${(ev: CustomEvent<{ action: ActionKind }>) => this._shortcutAction(sc, ev.detail.action)}
      >
        ${sc.icon || !entityState
          ? html`<ha-icon .icon=${sc.icon ?? "mdi:gesture-tap-button"}></ha-icon>`
          : html`<ha-state-icon .hass=${hass} .stateObj=${entityState}></ha-state-icon>`}
        ${showName ? html`<span class="name">${name}</span>` : nothing}
        ${badge
          ? html`<span
              class=${classMap({ badge: true, toned: !!badgeTone(sc) })}
              style=${styleMap(badgeTone(sc) ? { "--t": TONE_COLOR[badgeTone(sc)] } : {})}
              >${badge}</span
            >`
          : nothing}
      </button>
    `;
  }

  // ---- Actions ------------------------------------------------------------

  private _shortcutAction(sc: ShortcutConfig, action: ActionKind) {
    this._fireAction(
      {
        entity: sc.entity,
        tap_action: shortcutTapAction(sc, window.location.pathname),
        hold_action: sc.hold_action,
        double_tap_action: sc.double_tap_action,
      },
      action
    );
  }

  private _groupClick(g: PulseGroup) {
    const list = g.active.length ? g.active : g.entities;
    if (list.length === 1) this._moreInfo(list[0]);
    else this._openPopup(g.id);
  }

  /** Hand the action to Home Assistant's own handler (confirmation, navigate, perform-action, etc.). */
  private _fireAction(
    config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    action: ActionKind
  ) {
    const actionConfig = config[`${action}_action` as const];
    if (!actionConfig || actionConfig.action === "none") return;
    this.dispatchEvent(new CustomEvent("hass-action", { bubbles: true, composed: true, detail: { config, action } }));
  }

  private _moreInfo(entityId?: string) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId } }));
  }

  private _format(s: HassEntity): string {
    if (this.hass?.formatEntityState) return this.hass.formatEntityState(s);
    const unit = s.attributes.unit_of_measurement;
    const v = s.state.replace(/[_-]/g, " ");
    return unit ? `${s.state} ${unit}` : v.charAt(0).toUpperCase() + v.slice(1);
  }

  // ---- Popup --------------------------------------------------------------

  private _groupFromIndex(id: PulseId, index: HomeIndex): PulseGroup {
    return { id, entities: index[id] ?? [], active: [] };
  }

  private async _openPopup(id: PulseId) {
    const hass = this.hass!;
    // Any group can open, whether or not it is listed in `pulse` (the alerts line, for one).
    const g = pulseGroups(hass, { ...this._config!, pulse: [id] }, this._index ?? indexHome(hass, this._config!))[0];
    if (!g) return;
    // What needs attention, in a fixed order taken once, so nothing jumps while the popup is open.
    this._popupEntities = g.active.length ? [...g.active] : [...g.entities];
    this._popup = id;
    this._tiles = undefined;
    let helpers: CardHelpers | undefined;
    try {
      helpers = await (window as unknown as { loadCardHelpers?: () => Promise<CardHelpers> }).loadCardHelpers?.();
    } catch {
      helpers = undefined;
    }
    if (this._popup !== id) return;
    if (!helpers) {
      this._tiles = null;
      return;
    }
    const tiles = new Map<string, HTMLElement>();
    await Promise.all(
      this._popupEntities.map(async (entity) => {
        const el = await helpers!.createCardElement(this._tileConfig(entity));
        (el as unknown as { hass?: HomeAssistant }).hass = this.hass;
        tiles.set(entity, el);
      })
    );
    if (this._popup === id) this._tiles = tiles;
  }

  /** Native tile card config, with the control that makes sense for the domain (as in Area Pulse). */
  private _tileConfig(entity: string): Record<string, unknown> {
    const s = this.hass!.states[entity];
    const domain = entity.split(".")[0];
    const features: Record<string, unknown>[] = [];
    if (domain === "light") {
      const modes = (s?.attributes.supported_color_modes as string[] | undefined) ?? [];
      if (modes.some((m) => m !== "onoff")) features.push({ type: "light-brightness" });
    } else if (domain === "cover") {
      features.push({ type: "cover-open-close" });
    } else if (domain === "climate") {
      features.push({ type: "target-temperature" });
    } else if (domain === "media_player") {
      features.push({ type: "media-player-playback" });
    }
    return {
      type: "tile",
      entity,
      ...(features.length
        ? { features, features_position: domain === "light" || domain === "climate" ? "inline" : "bottom" }
        : {}),
    };
  }

  private _closePopup() {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog.hpc-popup")?.close();
  }

  private _onPopupClosed() {
    this._popup = undefined;
    this._tiles = undefined;
  }

  private _onPopupClick(ev: MouseEvent) {
    if (ev.target === ev.currentTarget) this._closePopup();
  }

  /** A tile asked for more-info: step aside so HA's dialog is on top, come back when it closes. */
  private _onPopupMoreInfo() {
    this._reopen = this._popup;
    this._closePopup();
  }

  private _bulkActions(g: PulseGroup): { label: string; icon: string; service: string }[] {
    if (!g.active.length) return [];
    const t = this._t;
    switch (g.id) {
      case "lights":
        return [{ label: t("turn_all_off"), icon: "mdi:lightbulb-group-off-outline", service: "light.turn_off" }];
      case "switches":
        return [{ label: t("turn_all_off"), icon: "mdi:power-plug-off-outline", service: "switch.turn_off" }];
      case "fans":
        return [{ label: t("turn_all_off"), icon: "mdi:fan-off", service: "fan.turn_off" }];
      case "covers":
        return [{ label: t("close_all"), icon: "mdi:arrow-down", service: "cover.close_cover" }];
      case "locks":
        return [{ label: t("lock_all"), icon: "mdi:lock", service: "lock.lock" }];
      case "media":
        return [{ label: t("pause_all"), icon: "mdi:pause", service: "media_player.media_pause" }];
      default:
        return [];
    }
  }

  private _renderPopup(g: PulseGroup) {
    const hass = this.hass!;
    const meta = PULSE_META[g.id];
    const active = g.active.length > 0;
    const title = this._t(`g_${g.id}`);
    const sub = this._t("n_of_m_active", { n: g.active.length, m: g.entities.length });
    const bulk = this._bulkActions(g);
    const sections = byArea(hass, this._popupEntities);
    return html`
      <dialog
        class="hpc-popup"
        aria-label=${title}
        style=${styleMap({ "--c": this._groupColor(g.id) })}
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
            <button class="popup-close" aria-label=${this._t("close")} @click=${() => this._closePopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          ${bulk.length
            ? html`<div class="popup-bulk">
                ${bulk.map(
                  (b) => html`<button
                    class="bulk"
                    @click=${() =>
                      this._fireAction(
                        { tap_action: { action: "perform-action", perform_action: b.service, target: { entity_id: [...g.active] } } },
                        "tap"
                      )}
                  >
                    <ha-icon .icon=${b.icon}></ha-icon>${b.label}
                  </button>`
                )}
              </div>`
            : nothing}
          <div class="popup-body">
            ${this._tiles === undefined
              ? nothing
              : sections.map(
                  (sec) => html`
                    ${sections.length > 1 || sec.area
                      ? html`<div class="area-head">${sec.area ?? this._t("no_area")}</div>`
                      : nothing}
                    <div class="popup-grid">
                      ${sec.entities.map((id) =>
                        this._tiles ? this._tiles.get(id) ?? nothing : this._miniTile(id, g.active.includes(id), this._groupColor(g.id))
                      )}
                    </div>
                  `
                )}
          </div>
        </div>
      </dialog>
    `;
  }

  /** Tile look-alike used when HA's card helpers can't be loaded. */
  private _miniTile(id: string, active: boolean, color: string) {
    const s = this.hass!.states[id];
    if (!s) return nothing;
    return html`
      <div
        class=${classMap({ "mini-tile": true, active })}
        style=${styleMap({ "--c": color })}
        role="button"
        tabindex="0"
        @click=${() => this._moreInfo(id)}
      >
        <div class="mt-icon"><ha-state-icon .hass=${this.hass} .stateObj=${s}></ha-state-icon></div>
        <div class="mt-text">
          <div class="mt-name">${s.attributes.friendly_name ?? id}</div>
          <div class="mt-state">${this._format(s)} · ${relativeTime(this.hass, s.last_changed)}</div>
        </div>
      </div>
    `;
  }
}

/**
 * Home Pulse Shortcuts: the shortcut tiles on their own (one card, one job). It is the overview card
 * showing only its `shortcuts` block, so tiles, badges, actions and the editor's shortcut list are shared.
 * Flat by default: every tile looks like a native tile card in the section.
 */
export class HomePulseShortcutsCard extends HomePulseCard {
  static getConfigElement() {
    return document.createElement("home-pulse-shortcuts-card-editor");
  }

  static getStubConfig(): Partial<HomePulseCardConfig> {
    // Navigation first; views that don't exist yet are easy to rename in the editor.
    return {
      shortcuts: [
        { name: "Lights", icon: "mdi:lightbulb-group", navigation_path: "lights", badge: "lights" },
        { name: "Climate", icon: "mdi:thermostat", navigation_path: "climate" },
        { name: "Security", icon: "mdi:shield-half-full", navigation_path: "security", badge: "locks" },
        { name: "Energy", icon: "mdi:lightning-bolt", navigation_path: "/energy" },
      ],
    };
  }

  setConfig(config: HomePulseCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    super.setConfig({ ...config, appearance: config.appearance ?? "flat", sections: ["shortcuts"] });
  }

  getCardSize(): number {
    const n = this._config?.shortcuts?.length ?? 0;
    const cols = Math.min(8, Math.max(1, Math.round(this._config?.columns ?? 4)));
    return Math.max(1, Math.ceil(n / cols) * 2);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 3, rows: "auto" as const };
  }

  protected get _showGlow(): boolean {
    return false;
  }

  protected render() {
    if (this.hass && this._config && !this._config.shortcuts?.length) {
      return html`<ha-card class="empty-card"
        ><div class="empty"><ha-icon icon="mdi:view-grid-outline"></ha-icon>${localize(this.hass, "shortcuts_empty")}</div></ha-card
      >`;
    }
    return super.render();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "home-pulse-shortcuts-card": HomePulseShortcutsCard;
  }
}

if (!customElements.get("home-pulse-card")) {
  customElements.define("home-pulse-card", HomePulseCard);
  customElements.define("home-pulse-shortcuts-card", HomePulseShortcutsCard);
  window.customCards = window.customCards || [];
  window.customCards.push(
    {
      type: "home-pulse-card",
      name: "Home Pulse Card",
      description: "The overview for the top of your dashboard: greeting, weather, today, people, alarm, house modes and quiet home hints.",
      preview: true,
    },
    {
      type: "home-pulse-shortcuts-card",
      name: "Home Pulse Shortcuts",
      description: "Large shortcut tiles to your other views, with live badges. The companion of Home Pulse Card.",
      preview: true,
    }
  );
}

