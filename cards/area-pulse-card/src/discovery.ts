import type { AreaPulseCardConfig, GroupId, HassEntity, HomeAssistant } from "./types";
import { NO_LABEL_FILTER, passesLabelFilter, type ResolvedLabelFilter } from "./labels";

export const DEFAULT_ALERT_CLASSES = [
  "moisture",
  "smoke",
  "gas",
  "carbon_monoxide",
  "safety",
  "problem",
  "tamper",
];

export const DEFAULT_GROUPS: GroupId[] = [
  "alerts",
  "motion",
  "doors",
  "windows",
  "climate",
  "lights",
  "switches",
  "fans",
  "covers",
  "locks",
  "media",
  "batteries",
];

/** Chips shown in the first row: what is open / moving in the room. Everything else goes in row two. */
export const DEFAULT_TOP_GROUPS: GroupId[] = ["motion", "doors", "windows"];

export const SENSOR_CLASS_OPTIONS = [
  "illuminance",
  "carbon_dioxide",
  "pm25",
  "volatile_organic_compounds",
  "pressure",
  "power",
  "energy",
  "sound_pressure",
];

/** Sensor device classes that are aggregated with a sum instead of a median (same as the native area card). */
const SUM_CLASSES = new Set(["power", "energy", "gas", "water", "current"]);

const UNAVAILABLE = new Set(["unavailable", "unknown"]);

export interface AreaIndex {
  /** Visible, primary entities (no hidden, no config/diagnostic) that pass the label filter. */
  primary: string[];
  /** Diagnostic entities too (used for batteries only). */
  withDiagnostic: string[];
  /** Primary entities in the area before the label filter, to tell "empty area" from "nothing matched". */
  unfilteredCount: number;
}

/** Resolve the entity ids that belong to an area, honouring device-area inheritance like HA does. */
export function indexArea(
  hass: HomeAssistant,
  areaId: string,
  exclude: string[] = [],
  labelFilter: ResolvedLabelFilter = NO_LABEL_FILTER
): AreaIndex {
  const primary: string[] = [];
  const withDiagnostic: string[] = [];
  let unfilteredCount = 0;
  const excluded = new Set(exclude);
  for (const entry of Object.values(hass.entities || {})) {
    if (entry.hidden || excluded.has(entry.entity_id)) continue;
    if (!hass.states[entry.entity_id]) continue;
    const device = entry.device_id ? hass.devices?.[entry.device_id] : undefined;
    const entityArea = entry.area_id ?? device?.area_id;
    if (entityArea !== areaId) continue;
    if (entry.entity_category === "config") continue;
    const isPrimary = entry.entity_category !== "diagnostic";
    if (isPrimary) unfilteredCount++;
    if (!passesLabelFilter(entry.labels, device?.labels, labelFilter)) continue;
    withDiagnostic.push(entry.entity_id);
    if (isPrimary) primary.push(entry.entity_id);
  }
  return { primary, withDiagnostic, unfilteredCount };
}

const domainOf = (id: string) => id.split(".")[0];
const dc = (s: HassEntity) => s.attributes.device_class as string | undefined;
const isAvailable = (s?: HassEntity) => !!s && !UNAVAILABLE.has(s.state);

export interface Group {
  id: GroupId;
  /** Entities that belong to the group at all. */
  entities: string[];
  /** Entities currently in an "active" (attention-worthy) state. */
  active: string[];
  /** Most recent state change across the group, used for "for 12 min". */
  lastChanged?: number;
}

function binaryClasses(hass: HomeAssistant, ids: string[], classes: string[]): string[] {
  return ids.filter((id) => {
    const s = hass.states[id];
    return domainOf(id) === "binary_sensor" && !!s && classes.includes(dc(s) ?? "");
  });
}

function makeGroup(
  hass: HomeAssistant,
  id: GroupId,
  entities: string[],
  isActive: (s: HassEntity) => boolean
): Group {
  const active = entities.filter((e) => {
    const s = hass.states[e];
    return isAvailable(s) && isActive(s);
  });
  let lastChanged: number | undefined;
  for (const e of entities) {
    const t = Date.parse(hass.states[e]?.last_changed ?? "");
    if (!Number.isNaN(t) && (lastChanged === undefined || t > lastChanged)) lastChanged = t;
  }
  return { id, entities, active, lastChanged };
}

export function buildGroups(
  hass: HomeAssistant,
  config: AreaPulseCardConfig,
  index: AreaIndex
): Partial<Record<GroupId, Group>> {
  const ids = index.primary;
  const byDomain = (d: string) => ids.filter((id) => domainOf(id) === d);
  const out: Partial<Record<GroupId, Group>> = {};
  const add = (g: Group) => {
    if (g.entities.length) out[g.id] = g;
  };

  // Presence: explicit list wins; otherwise occupancy/presence binary sensors (+ mmWave-style presence).
  const presenceIds = config.presence_entities?.length
    ? config.presence_entities.filter((e) => hass.states[e])
    : binaryClasses(hass, ids, ["occupancy", "presence"]);
  const motionIds = binaryClasses(hass, ids, ["motion"]);
  // If the area has no dedicated presence sensors, motion sensors drive presence.
  add(
    makeGroup(hass, "presence", presenceIds.length ? presenceIds : motionIds, (s) =>
      ["on", "home", "detected"].includes(s.state)
    )
  );
  add(makeGroup(hass, "motion", motionIds, (s) => s.state === "on"));

  add(makeGroup(hass, "doors", binaryClasses(hass, ids, ["door", "garage_door", "opening"]), (s) => s.state === "on"));
  add(makeGroup(hass, "windows", binaryClasses(hass, ids, ["window"]), (s) => s.state === "on"));
  add(makeGroup(hass, "covers", byDomain("cover"), (s) => ["open", "opening"].includes(s.state)));
  add(makeGroup(hass, "locks", byDomain("lock"), (s) => ["unlocked", "open", "opening", "jammed"].includes(s.state)));
  add(makeGroup(hass, "lights", byDomain("light"), (s) => s.state === "on"));
  add(makeGroup(hass, "fans", byDomain("fan"), (s) => s.state === "on"));
  // Smart plugs and relays. Switches that duplicate a light (wall relays exposed as both) are usually hidden in HA.
  add(makeGroup(hass, "switches", byDomain("switch"), (s) => s.state === "on"));
  add(makeGroup(hass, "media", byDomain("media_player"), (s) => s.state === "playing"));
  add(
    makeGroup(hass, "climate", byDomain("climate"), (s) =>
      ["heating", "cooling", "drying", "fan"].includes(String(s.attributes.hvac_action ?? ""))
        || (!s.attributes.hvac_action && s.state !== "off")
    )
  );
  add(
    makeGroup(hass, "alerts", binaryClasses(hass, ids, config.alert_classes ?? DEFAULT_ALERT_CLASSES), (s) => s.state === "on")
  );

  const threshold = config.battery_threshold ?? 20;
  const batteryIds = index.withDiagnostic.filter((id) => {
    const s = hass.states[id];
    return dc(s) === "battery" && (domainOf(id) === "sensor" || domainOf(id) === "binary_sensor");
  });
  add(
    makeGroup(hass, "batteries", batteryIds, (s) =>
      domainOf(s.entity_id) === "binary_sensor" ? s.state === "on" : Number(s.state) <= threshold
    )
  );
  return out;
}

export interface Reading {
  deviceClass: string;
  value: number;
  unit: string;
  entities: string[];
}

function median(values: number[]): number {
  const v = [...values].sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

/** Aggregate numeric sensors of a device class: explicit entity > area setting > median/sum. */
export function reading(
  hass: HomeAssistant,
  index: AreaIndex,
  deviceClass: string,
  explicit?: string | null
): Reading | undefined {
  if (explicit && hass.states[explicit]) {
    const s = hass.states[explicit];
    const value = Number(s.state);
    if (!isAvailable(s) || Number.isNaN(value)) return undefined;
    return { deviceClass, value, unit: String(s.attributes.unit_of_measurement ?? ""), entities: [explicit] };
  }
  const candidates = index.primary
    .map((id) => hass.states[id])
    .filter(
      (s) => domainOf(s.entity_id) === "sensor" && dc(s) === deviceClass && isAvailable(s) && !Number.isNaN(Number(s.state))
    );
  if (!candidates.length) return undefined;
  const unit = String(candidates[0].attributes.unit_of_measurement ?? "");
  const same = candidates.filter((s) => String(s.attributes.unit_of_measurement ?? "") === unit);
  const values = same.map((s) => Number(s.state));
  const value = SUM_CLASSES.has(deviceClass) ? values.reduce((a, b) => a + b, 0) : median(values);
  return { deviceClass, value, unit, entities: same.map((s) => s.entity_id) };
}

/** Comfort band evaluation for temperature/humidity colouring. */
export function comfortState(
  value: number,
  band: [number, number] | { min?: number; max?: number } | undefined,
  fallback: [number, number]
): "low" | "ok" | "high" {
  const [min, max] = Array.isArray(band)
    ? band
    : [band?.min ?? fallback[0], band?.max ?? fallback[1]];
  if (value < min) return "low";
  if (value > max) return "high";
  return "ok";
}

/** How many chips the card face shows before the rest collapse into a "+N" chip. */
export const DEFAULT_MAX_CHIPS = 3;

/**
 * Which chips win a place on the card face when there are more than `max_chips`:
 * problems, then openings, then lights, climate and media, then the rest.
 */
export const CHIP_PRIORITY: GroupId[] = [
  "alerts",
  "batteries",
  "locks",
  "doors",
  "windows",
  "lights",
  "climate",
  "media",
  "covers",
  "fans",
  "switches",
  "motion",
];

/** Colour meaning of a chip with `chip_colors: state`: problem, needs a look, light on, or none. */
export type ChipTone = "" | "on" | "warn" | "bad";

export function chipTone(id: GroupId): ChipTone {
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

/** A status chip the card could show. */
export interface ChipCandidate {
  group: GroupId;
  active: boolean;
}

/**
 * Out-of-range level of a `sensor_classes` reading, shown in the climate block: CO₂ from 1000 ppm (warn) and
 * 1500 ppm (bad), PM2.5 from 12 and 35 µg/m³. Readings without an agreed range are never coloured.
 */
export function readingSeverity(r: Pick<Reading, "deviceClass" | "value">): "" | "warn" | "bad" {
  if (r.deviceClass === "carbon_dioxide") return r.value >= 1500 ? "bad" : r.value >= 1000 ? "warn" : "";
  if (r.deviceClass === "pm25") return r.value >= 35 ? "bad" : r.value >= 12 ? "warn" : "";
  return "";
}

/**
 * Split chips into the ones on the card face and the ones behind "+N". `max <= 0` shows everything in the
 * given order (the way back to the old look). With a cap:
 *  - Active chips fill the slots in `CHIP_PRIORITY` order.
 *  - Inactive chips ("Doors closed") never take a slot an active chip wants and never count towards "+N";
 *    they only fill slots that are left free (the card passes them only with `show_inactive`).
 *  - Exactly one chip too many shows it instead of a "+1" chip, which would take the same space.
 * Nothing active and nothing to fill means an empty face: the card then draws no chip row.
 */
export function pickChips<T extends ChipCandidate>(items: T[], max: number): { shown: T[]; hidden: T[] } {
  if (max <= 0) return { shown: items, hidden: [] };
  const rank = (c: T): number => {
    const i = CHIP_PRIORITY.indexOf(c.group);
    return i < 0 ? CHIP_PRIORITY.length : i;
  };
  const sort = (list: T[]) =>
    list
      .map((c, i) => ({ c, i, r: rank(c) }))
      .sort((a, b) => a.r - b.r || a.i - b.i)
      .map((x) => x.c);
  const active = sort(items.filter((c) => c.active));
  const inactive = sort(items.filter((c) => !c.active));
  if (active.length > max + 1) return { shown: active.slice(0, max), hidden: active.slice(max) };
  return { shown: [...active, ...inactive.slice(0, Math.max(0, max - active.length))], hidden: [] };
}

/** Every entity whose state change can alter the card. Used to skip needless re-renders. */
export function watchedEntities(
  config: AreaPulseCardConfig,
  index: AreaIndex
): Set<string> {
  const set = new Set(index.withDiagnostic);
  for (const e of [config.temperature_entity, config.humidity_entity, config.main_light, ...(config.presence_entities ?? [])]) {
    if (e) set.add(e);
  }
  for (const a of config.actions ?? []) if (a.entity) set.add(a.entity);
  return set;
}

const MAIN_LIGHT_HINT = /ceiling|main|overhead|central|chandelier|κεντρικ|ταβάν|οροφ/i;

/**
 * The light the area icon toggles: explicit config > a light whose name suggests it is the main one >
 * the only light in the area. Returns undefined when the choice would be a guess.
 */
export function findMainLight(
  hass: HomeAssistant,
  config: AreaPulseCardConfig,
  index: AreaIndex
): string | undefined {
  if (config.link_main_light === false) return undefined;
  if (config.main_light) return hass.states[config.main_light] ? config.main_light : undefined;
  const lights = index.primary.filter((id) => domainOf(id) === "light");
  if (lights.length === 1) return lights[0];
  return lights.find((id) =>
    MAIN_LIGHT_HINT.test(`${id} ${hass.states[id]?.attributes.friendly_name ?? ""}`)
  );
}

/** Colour a light is emitting, as [r, g, b], or undefined when it is off or reports no colour. */
export function lightColor(s?: HassEntity): [number, number, number] | undefined {
  if (!s || s.state !== "on") return undefined;
  const rgb = s.attributes.rgb_color as number[] | undefined;
  if (Array.isArray(rgb) && rgb.length === 3) return [rgb[0], rgb[1], rgb[2]];
  const k = s.attributes.color_temp_kelvin as number | undefined;
  if (typeof k === "number") return kelvinToRgb(k);
  const hs = s.attributes.hs_color as number[] | undefined;
  if (Array.isArray(hs) && hs.length === 2) return hsToRgb(hs[0], hs[1]);
  return undefined;
}

function clamp(v: number) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/** Tanner Helland's approximation, good enough for a background tint. */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const t = kelvin / 100;
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [clamp(r), clamp(g), clamp(b)];
}

function hsToRgb(h: number, sPct: number): [number, number, number] {
  const s = sPct / 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return 255 * (1 - s * Math.max(0, Math.min(k, 4 - k, 1)));
  };
  return [clamp(f(5)), clamp(f(3)), clamp(f(1))];
}
