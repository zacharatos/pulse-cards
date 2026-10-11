// Pure logic: turns `hass` + config into plain data for the card. No DOM in here; every function has a test.
import type {
  ActionConfig,
  AlarmMode,
  HassEntity,
  HomeAssistant,
  HomePulseCardConfig,
  PulseId,
  SectionId,
  ShortcutConfig,
} from "./types";

/** All blocks, in their natural order. */
export const SECTION_IDS: SectionId[] = ["greeting", "status", "alerts", "nudges", "modes", "alarm", "pulse", "shortcuts"];
/**
 * Shown by default: an overview whose main job is navigation. `alerts` and `nudges` render nothing
 * until they have something to say; `modes` renders nothing until there is a mode entity or a list. The alarm panel and the home pulse are opt-in: they repeat what
 * Area Pulse cards already show room by room.
 */
export const DEFAULT_SECTIONS: SectionId[] = ["greeting", "status", "alerts", "nudges", "modes", "shortcuts"];

/** Same alert classes as Area Pulse Card. */
export const DEFAULT_ALERT_CLASSES = ["moisture", "smoke", "gas", "carbon_monoxide", "safety", "problem", "tamper"];

export const PULSE_IDS: PulseId[] = [
  "alerts",
  "lights",
  "doors",
  "windows",
  "covers",
  "locks",
  "fans",
  "switches",
  "media",
  "climate",
  "batteries",
];
/** Shown by default. Covers, fans and switches are noisy home-wide, so they are opt-in. */
export const DEFAULT_PULSE: PulseId[] = ["alerts", "lights", "doors", "windows", "locks", "media", "climate", "batteries"];

export const ALARM_MODES: AlarmMode[] = ["arm_home", "arm_away", "arm_night", "arm_vacation", "arm_custom_bypass"];
export const DEFAULT_ALARM_MODES: AlarmMode[] = ["arm_home", "arm_away"];

/** AlarmControlPanelEntityFeature bits. */
const ALARM_SUPPORT: Record<AlarmMode, number> = {
  arm_home: 1,
  arm_away: 2,
  arm_night: 4,
  arm_custom_bypass: 16,
  arm_vacation: 32,
};

export const domainOf = (id: string) => id.split(".")[0];
const dc = (s?: HassEntity) => s?.attributes.device_class as string | undefined;

// ---- Greeting -------------------------------------------------------------

/**
 * Night for the ambient glow: the `sun.sun` entity when there is one (below the horizon), otherwise
 * the clock (20:00–06:59).
 */
export function isNight(sun: HassEntity | undefined, hour: number): boolean {
  if (sun?.state === "below_horizon") return true;
  if (sun?.state === "above_horizon") return false;
  return hour >= 20 || hour < 7;
}

export type GreetingKey = "greet_morning" | "greet_afternoon" | "greet_evening" | "greet_night";

export function greetingKey(hour: number): GreetingKey {
  if (hour >= 5 && hour < 12) return "greet_morning";
  if (hour >= 12 && hour < 17) return "greet_afternoon";
  if (hour >= 17 && hour < 22) return "greet_evening";
  return "greet_night";
}

/** First name of the logged-in user, capitalised ("alex demo" → "Alex"). */
export function firstName(name?: string | null): string {
  const first = (name ?? "").trim().split(/\s+/)[0] ?? "";
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "";
}

// ---- Entity discovery -------------------------------------------------------

/** Entities the user hid in HA, or config/diagnostic ones, never show up on their own. */
function isVisible(hass: HomeAssistant, id: string, allowDiagnostic = false): boolean {
  const e = hass.entities?.[id];
  if (!e) return true; // YAML entities have no registry entry
  if (e.hidden) return false;
  if (e.entity_category === "config") return false;
  if (e.entity_category === "diagnostic" && !allowDiagnostic) return false;
  return true;
}

const byName = (hass: HomeAssistant) => (a: string, b: string) =>
  String(hass.states[a]?.attributes.friendly_name ?? a).localeCompare(
    String(hass.states[b]?.attributes.friendly_name ?? b)
  );

/** People: the configured list, or every visible `person` entity sorted by name. */
export function discoverPersons(hass: HomeAssistant, config: HomePulseCardConfig): string[] {
  if (config.persons?.length) return config.persons.filter((id) => hass.states[id]);
  return Object.keys(hass.states)
    .filter((id) => domainOf(id) === "person" && isVisible(hass, id))
    .sort(byName(hass));
}

/**
 * One entity of a domain: an explicit id wins (even if hidden), `none` turns it off,
 * otherwise the first visible entity of the domain, by name.
 */
export function discoverOne(hass: HomeAssistant, domain: string, explicit?: string): string | undefined {
  if (explicit === "none") return undefined;
  if (explicit) return explicit;
  return Object.keys(hass.states)
    .filter((id) => domainOf(id) === domain && isVisible(hass, id) && hass.states[id].state !== "unavailable")
    .sort(byName(hass))[0];
}

export function isHome(s?: HassEntity): boolean {
  return s?.state === "home";
}

// ---- Whole-home pulse -----------------------------------------------------

export type HomeIndex = Record<PulseId, string[]>;

/**
 * Which entities feed each pulse group. Built from the registry once (cached by the card against
 * `hass.entities` and the config) so a busy home is scanned only when the registry changes.
 */
export function indexHome(hass: HomeAssistant, config: HomePulseCardConfig): HomeIndex {
  const out = Object.fromEntries(PULSE_IDS.map((id) => [id, [] as string[]])) as HomeIndex;
  const exclude = new Set(config.exclude_entities ?? []);
  const alertClasses = new Set(config.alert_classes ?? DEFAULT_ALERT_CLASSES);
  for (const id of Object.keys(hass.states)) {
    if (exclude.has(id)) continue;
    const s = hass.states[id];
    const domain = domainOf(id);
    const cls = dc(s);
    // Batteries live on diagnostic entities; everything else uses the normal, visible ones.
    if ((domain === "sensor" || domain === "binary_sensor") && cls === "battery") {
      if (isVisible(hass, id, true)) out.batteries.push(id);
      continue;
    }
    if (!isVisible(hass, id)) continue;
    // Light/switch/fan groups list their members in `entity_id`; counting both would double up.
    if (Array.isArray(s.attributes.entity_id)) continue;
    switch (domain) {
      case "light": out.lights.push(id); break;
      case "fan": out.fans.push(id); break;
      case "switch": out.switches.push(id); break;
      case "cover": out.covers.push(id); break;
      case "lock": out.locks.push(id); break;
      case "media_player": out.media.push(id); break;
      case "climate": out.climate.push(id); break;
      case "binary_sensor":
        if (cls === "window") out.windows.push(id);
        else if (cls === "door" || cls === "garage_door" || cls === "opening") out.doors.push(id);
        else if (cls && alertClasses.has(cls)) out.alerts.push(id);
        break;
    }
  }
  for (const id of PULSE_IDS) out[id].sort(byName(hass));
  return out;
}

/** Same "active" rules as the Area Pulse Card groups. */
export function isActive(group: PulseId, s: HassEntity | undefined, batteryThreshold = 20): boolean {
  if (!s) return false;
  switch (group) {
    case "lights":
    case "fans":
    case "switches":
    case "doors":
    case "windows":
    case "alerts":
      return s.state === "on";
    case "covers":
      return s.state === "open" || s.state === "opening";
    case "locks":
      return ["unlocked", "open", "opening", "jammed"].includes(s.state);
    case "media":
      return s.state === "playing";
    case "climate": {
      const action = s.attributes.hvac_action as string | undefined;
      if (action) return ["heating", "cooling", "drying", "fan"].includes(action);
      return s.state !== "off" && s.state !== "unavailable" && s.state !== "unknown";
    }
    case "batteries":
      if (domainOf(s.entity_id) === "binary_sensor") return s.state === "on";
      return s.state !== "" && !Number.isNaN(Number(s.state)) && Number(s.state) <= batteryThreshold;
  }
}

export interface PulseGroup {
  id: PulseId;
  entities: string[];
  active: string[];
}

/**
 * What a group's colour means (the same rule as Area Pulse's `chip_colors: state`): a problem, something
 * that needs a look, lights on, or nothing worth a colour.
 */
export type PulseTone = "" | "on" | "warn" | "bad";

export function pulseTone(id: PulseId): PulseTone {
  switch (id) {
    case "alerts":
    case "batteries":
    case "locks":
      return "bad";
    case "doors":
    case "windows":
      return "warn";
    case "lights":
      return "on";
    default:
      return "";
  }
}

export function pulseGroups(hass: HomeAssistant, config: HomePulseCardConfig, index: HomeIndex): PulseGroup[] {
  const threshold = config.battery_threshold ?? 20;
  return (config.pulse ?? DEFAULT_PULSE)
    .filter((id) => PULSE_IDS.includes(id))
    .map((id) => {
      const entities = index[id];
      return { id, entities, active: entities.filter((e) => isActive(id, hass.states[e], threshold)) };
    })
    .filter((g) => g.entities.length > 0);
}

/** Area name of an entity, directly or through its device. */
export function areaName(hass: HomeAssistant, id: string): string | undefined {
  const e = hass.entities?.[id];
  const areaId = e?.area_id ?? (e?.device_id ? hass.devices?.[e.device_id]?.area_id : undefined);
  return areaId ? hass.areas?.[areaId]?.name ?? undefined : undefined;
}

/** Entities grouped by area for the popup; entities without an area come last. */
export function byArea(hass: HomeAssistant, ids: string[]): { area?: string; entities: string[] }[] {
  const map = new Map<string | undefined, string[]>();
  for (const id of ids) {
    const a = areaName(hass, id);
    if (!map.has(a)) map.set(a, []);
    map.get(a)!.push(id);
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a === undefined ? 1 : b === undefined ? -1 : a.localeCompare(b)))
    .map(([area, entities]) => ({ area, entities }));
}

// ---- Alarm ------------------------------------------------------------------

export type AlarmTone = "disarmed" | "armed" | "pending" | "triggered" | "unknown";

export interface AlarmButton {
  /** `disarm` or an arm mode. */
  mode: AlarmMode | "disarm";
  service: string;
  /** A code is needed: open HA's own keypad (more-info) instead of calling the service. */
  needsCode: boolean;
}

export interface AlarmView {
  state: string;
  tone: AlarmTone;
  buttons: AlarmButton[];
}

export function alarmView(s: HassEntity | undefined, modes: AlarmMode[] = DEFAULT_ALARM_MODES): AlarmView | undefined {
  if (!s) return undefined;
  const state = s.state;
  const tone: AlarmTone =
    state === "disarmed"
      ? "disarmed"
      : state === "triggered"
      ? "triggered"
      : state === "arming" || state === "pending" || state === "disarming"
      ? "pending"
      : state.startsWith("armed")
      ? "armed"
      : "unknown";
  const hasCode = s.attributes.code_format != null;
  const features = s.attributes.supported_features as number | undefined;
  let buttons: AlarmButton[] = [];
  if (tone === "disarmed") {
    const armNeedsCode = hasCode && s.attributes.code_arm_required !== false;
    buttons = modes
      .filter((m) => ALARM_SUPPORT[m] !== undefined)
      .filter((m) => features === undefined || (features & ALARM_SUPPORT[m]) !== 0)
      .map((m) => ({ mode: m, service: `alarm_control_panel.alarm_${m}`, needsCode: armNeedsCode }));
  } else if (tone !== "unknown") {
    buttons = [{ mode: "disarm", service: "alarm_control_panel.alarm_disarm", needsCode: hasCode }];
  }
  return { state, tone, buttons };
}

// ---- Nudges ---------------------------------------------------------------

export type NudgeId = "away_doors" | "away_windows" | "away_locks" | "away_lights" | "away_media" | "away_alarm";

/** Groups the nudges look at, in the order they are reported: the house's safety first. */
export const NUDGE_GROUPS: PulseId[] = ["doors", "windows", "locks", "lights", "media"];

export interface Nudge {
  id: NudgeId;
  n: number;
  entities: string[];
  /** The one-tap fix. */
  action?: ActionConfig;
  /** No fix from afar (an open window): show which ones instead. */
  popup?: PulseId;
}

/**
 * Hints for when nobody is home: doors or windows left open, locks unlocked, lights still on, media
 * still playing, alarm still disarmed. Needs at least one tracked person, otherwise "nobody home"
 * can't be known.
 */
export function nudges(
  hass: HomeAssistant,
  persons: string[],
  groups: PulseGroup[],
  alarm?: string
): Nudge[] {
  if (!persons.length || persons.some((p) => isHome(hass.states[p]))) return [];
  const out: Nudge[] = [];
  const active = (id: PulseId) => groups.find((g) => g.id === id)?.active ?? [];
  for (const id of ["doors", "windows"] as const) {
    const open = active(id);
    if (open.length) out.push({ id: `away_${id}`, n: open.length, entities: open, popup: id });
  }
  const unlocked = active("locks");
  if (unlocked.length)
    out.push({
      id: "away_locks",
      n: unlocked.length,
      entities: unlocked,
      action: { action: "perform-action", perform_action: "lock.lock", target: { entity_id: unlocked } },
    });
  const lights = active("lights");
  if (lights.length)
    out.push({
      id: "away_lights",
      n: lights.length,
      entities: lights,
      action: { action: "perform-action", perform_action: "light.turn_off", target: { entity_id: lights } },
    });
  const media = active("media");
  if (media.length)
    out.push({
      id: "away_media",
      n: media.length,
      entities: media,
      action: { action: "perform-action", perform_action: "media_player.media_pause", target: { entity_id: media } },
    });
  const a = alarm ? alarmView(hass.states[alarm]) : undefined;
  const away = a?.buttons.find((b) => b.mode === "arm_away");
  if (a?.tone === "disarmed" && away)
    out.push({
      id: "away_alarm",
      n: 1,
      entities: [alarm!],
      action: away.needsCode
        ? { action: "more-info", entity: alarm }
        : { action: "perform-action", perform_action: away.service, target: { entity_id: alarm } },
    });
  return out;
}

// ---- Shortcuts --------------------------------------------------------------

/**
 * Row sizes for `n` tiles with at most `cols` per row, as even as possible, fuller rows first:
 * 7 in 4 → [4, 3], 5 in 4 → [3, 2], 9 in 4 → [3, 3, 3]. Each row stretches to the full width.
 */
export function balanceRows(n: number, cols: number): number[] {
  if (n <= 0) return [];
  const c = Math.max(1, Math.floor(cols));
  const rows = Math.ceil(n / c);
  const base = Math.floor(n / rows);
  const extra = n % rows;
  return Array.from({ length: rows }, (_, i) => base + (i < extra ? 1 : 0));
}

/** `lights` on `/home-dash/0` → `/home-dash/lights`. Absolute paths and `#anchors` pass through. */
export function resolveNavigationPath(path: string, currentPathname: string): string {
  if (!path || path.startsWith("/") || path.startsWith("#") || path.startsWith("?")) return path;
  const dashboard = currentPathname.split("/").filter(Boolean)[0] ?? "lovelace";
  return `/${dashboard}/${path}`;
}

/** The tap action a shortcut runs: an explicit `tap_action` wins over the `navigation_path` shorthand. */
export function shortcutTapAction(sc: ShortcutConfig, currentPathname: string): ActionConfig | undefined {
  if (sc.tap_action) return sc.tap_action;
  if (sc.navigation_path)
    return { action: "navigate", navigation_path: resolveNavigationPath(sc.navigation_path, currentPathname) };
  if (sc.entity) return { action: "more-info", entity: sc.entity };
  return undefined;
}

const ON_STATES = new Set(["on", "open", "opening", "playing", "unlocked", "cleaning", "home", "heat", "cool", "heat_cool", "auto", "dry", "fan_only"]);

export function shortcutActive(hass: HomeAssistant, sc: ShortcutConfig): boolean {
  return !!sc.entity && ON_STATES.has(hass.states[sc.entity]?.state ?? "");
}

/**
 * Badge text: a pulse id shows how many are active (nothing when zero), an entity id shows its state.
 * Pulse groups not shown in the pulse block are still counted from the index.
 */
/** Colour meaning of a badge: a group count carries its group's tone, an entity's state carries none. */
export function badgeTone(sc: ShortcutConfig): PulseTone {
  return sc.badge && PULSE_IDS.includes(sc.badge as PulseId) ? pulseTone(sc.badge as PulseId) : "";
}

export function shortcutBadge(
  hass: HomeAssistant,
  sc: ShortcutConfig,
  index: HomeIndex,
  batteryThreshold = 20
): string | undefined {
  const badge = sc.badge;
  if (!badge) return undefined;
  if (PULSE_IDS.includes(badge as PulseId)) {
    const n = index[badge as PulseId].filter((e) => isActive(badge as PulseId, hass.states[e], batteryThreshold)).length;
    return n ? String(n) : undefined;
  }
  const s = hass.states[badge];
  if (!s || s.state === "unavailable" || s.state === "unknown") return undefined;
  if (s.state === "0" || s.state === "off") return undefined;
  // Badges are tiny: keep only units that read well in two or three characters.
  const unit = s.attributes.unit_of_measurement;
  if (unit === "%") return `${s.state}%`;
  if (unit === "°C" || unit === "°F") return `${s.state}°`;
  return s.state;
}

// ---- Updates ------------------------------------------------------------------

/** Entities whose state changes must re-render the card. Everything else is ignored. */
export function watchedEntities(
  config: HomePulseCardConfig,
  index: HomeIndex,
  persons: string[],
  extra: (string | undefined)[]
): Set<string> {
  const out = new Set<string>(persons);
  for (const e of extra) if (e) out.add(e);
  for (const c of config.chips ?? []) if (c.entity) out.add(c.entity);
  for (const sc of config.shortcuts ?? []) {
    if (sc.entity) out.add(sc.entity);
    if (sc.badge && sc.badge.includes(".")) out.add(sc.badge);
  }
  // Only the groups something on the card shows: the pulse block, the alerts block, the nudges
  // (openings, locks, lights and media), and shortcut badges.
  const sections = config.sections ?? DEFAULT_SECTIONS;
  const pulse = new Set<PulseId>();
  if (sections.includes("pulse")) for (const id of config.pulse ?? DEFAULT_PULSE) pulse.add(id);
  if (sections.includes("alerts")) pulse.add("alerts");
  if (sections.includes("nudges") && config.nudges !== false) for (const id of NUDGE_GROUPS) pulse.add(id);
  for (const sc of config.shortcuts ?? []) if (sc.badge && PULSE_IDS.includes(sc.badge as PulseId)) pulse.add(sc.badge as PulseId);
  for (const id of pulse) for (const e of index[id] ?? []) out.add(e);
  return out;
}

// ---- Misc -----------------------------------------------------------------------

/** HA colour name (`amber`) or any CSS colour. Same rule as Area Pulse Card. */
export function cssColor(color: string): string {
  if (/^(#|rgb|hsl|var\()/i.test(color)) return color;
  if (color === "primary" || color === "accent") return `var(--${color}-color)`;
  return `var(--${color}-color, ${color})`;
}

const WEATHER_ICONS: Record<string, string> = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  exceptional: "mdi:alert-circle-outline",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
};

export function weatherIcon(condition: string): string {
  return WEATHER_ICONS[condition] ?? "mdi:weather-partly-cloudy";
}

/** Weather temperature rounded for a chip: "24°". */
export function weatherTemp(s?: HassEntity): string | undefined {
  const t = s?.attributes.temperature;
  if (typeof t !== "number") return undefined;
  return `${Math.round(t)}°`;
}
