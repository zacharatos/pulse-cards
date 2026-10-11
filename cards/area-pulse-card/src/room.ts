// The room sheet: what goes into the popup that opens when you tap the card, and in which order.
// Pure logic (no DOM), so it can be unit-tested with `npm test`.
//
// Design rules, from looking at HA's own area dialog with a few hundred entities:
//  - Things that need attention come first, then the things you act on (lights, climate, media...),
//    then passive status (presence, doors), then read-only sensors last.
//  - Read-only sensors are dense stat cells, not full-size tiles.
//  - The order is decided once when the sheet opens, so rows never jump while you use a slider.

import type { AreaPulseCardConfig, HassEntity, HomeAssistant } from "./types";
import { DEFAULT_ALERT_CLASSES, type AreaIndex } from "./discovery";

export type RoomSectionId =
  | "attention"
  | "lights"
  | "climate"
  | "media"
  | "covers"
  | "locks"
  | "fans"
  | "switches"
  | "other"
  | "status"
  | "sensors";

/** How a section is drawn: native tiles, compact status rows or dense stat cells. */
export type RoomSectionKind = "tiles" | "status" | "stats";

export type AttentionReason = "alert" | "battery" | "unavailable";

export interface RoomSection {
  id: RoomSectionId;
  kind: RoomSectionKind;
  entities: string[];
  /** Only for `attention`: why each entity is there. */
  reasons?: Record<string, AttentionReason>;
}

export interface RoomModel {
  sections: RoomSection[];
  /** Entities shown in the sheet, all sections together. */
  total: number;
}

export const SECTION_ORDER: RoomSectionId[] = [
  "attention",
  "lights",
  "climate",
  "media",
  "covers",
  "locks",
  "fans",
  "switches",
  "other",
  "status",
  "sensors",
];

const DOMAIN_SECTION: Record<string, RoomSectionId> = {
  light: "lights",
  climate: "climate",
  humidifier: "climate",
  water_heater: "climate",
  media_player: "media",
  cover: "covers",
  valve: "covers",
  lock: "locks",
  fan: "fans",
  switch: "switches",
  binary_sensor: "status",
  person: "status",
  device_tracker: "status",
  sensor: "sensors",
};

/** Domains that are noise in a room view: nobody wants an "update available" tile there. */
const SKIPPED_DOMAINS = new Set([
  "update",
  "automation",
  "event",
  "conversation",
  "tts",
  "stt",
  "wake_word",
  "todo",
  "notify",
  "ai_task",
]);

const UNAVAILABLE = "unavailable";

/**
 * Domains whose "unavailable" is normal, not a fault: many media players (TVs, casts, speakers) drop off
 * the network when they're switched off. They stay in their own section instead of "Needs attention".
 */
const UNAVAILABLE_IS_NORMAL = new Set(["media_player"]);
const domainOf = (id: string) => id.split(".")[0];
const deviceClass = (s?: HassEntity) => s?.attributes.device_class as string | undefined;

/** "On" in the sense of "doing something": used to put active things first. */
export function isActiveState(s?: HassEntity): boolean {
  if (!s) return false;
  return [
    "on",
    "playing",
    "open",
    "opening",
    "closing",
    "unlocked",
    "cleaning",
    "heat",
    "cool",
    "heat_cool",
    "auto",
    "dry",
    "fan_only",
    "home",
    "detected",
  ].includes(s.state);
}

const STATUS_CLASS_RANK: Record<string, number> = {
  occupancy: 0,
  presence: 0,
  motion: 0,
  door: 1,
  garage_door: 1,
  window: 1,
  opening: 1,
};

const SENSOR_CLASS_RANK = [
  "temperature",
  "humidity",
  "carbon_dioxide",
  "pm25",
  "pm10",
  "volatile_organic_compounds",
  "volatile_organic_compounds_parts",
  "illuminance",
  "pressure",
  "sound_pressure",
  "power",
  "energy",
];

const isNumeric = (s: HassEntity) => s.state.trim() !== "" && !Number.isNaN(Number(s.state));

function displayName(hass: HomeAssistant, id: string): string {
  return (hass.states[id]?.attributes.friendly_name as string | undefined) ?? id;
}

/** Fixed-order comparison that does not depend on the user's locale settings. */
const byName = (hass: HomeAssistant) => (a: string, b: string) =>
  displayName(hass, a).localeCompare(displayName(hass, b), undefined, { numeric: true, sensitivity: "base" });

function sortSection(hass: HomeAssistant, section: RoomSection): void {
  const name = byName(hass);
  const active = (id: string) => Number(isActiveState(hass.states[id]));
  switch (section.kind) {
    case "tiles":
      section.entities.sort((a, b) => active(b) - active(a) || name(a, b));
      break;
    case "status": {
      const rank = (id: string) => STATUS_CLASS_RANK[deviceClass(hass.states[id]) ?? ""] ?? 2;
      section.entities.sort((a, b) => active(b) - active(a) || rank(a) - rank(b) || name(a, b));
      break;
    }
    case "stats": {
      const rank = (id: string) => {
        const s = hass.states[id];
        const i = SENSOR_CLASS_RANK.indexOf(deviceClass(s) ?? "");
        // Numeric sensors first, ordered by usefulness; text sensors last.
        return (isNumeric(s) ? 0 : 100) + (i === -1 ? SENSOR_CLASS_RANK.length : i);
      };
      section.entities.sort((a, b) => rank(a) - rank(b) || name(a, b));
      break;
    }
  }
}

function isLowBattery(s: HassEntity | undefined, threshold: number): boolean {
  if (!s || deviceClass(s) !== "battery") return false;
  if (domainOf(s.entity_id) === "binary_sensor") return s.state === "on";
  if (domainOf(s.entity_id) !== "sensor") return false;
  const v = Number(s.state);
  return !Number.isNaN(v) && s.state.trim() !== "" && v <= threshold;
}

/**
 * Lay out the room sheet. `index` already carries the label filter, so a filtered card gets a
 * filtered sheet for free.
 */
export function buildRoom(hass: HomeAssistant, config: AreaPulseCardConfig, index: AreaIndex): RoomModel {
  const alertClasses = new Set(config.alert_classes ?? DEFAULT_ALERT_CLASSES);
  const threshold = config.battery_threshold ?? 20;
  const sections = new Map<RoomSectionId, RoomSection>();
  const section = (id: RoomSectionId, kind: RoomSectionKind): RoomSection => {
    let s = sections.get(id);
    if (!s) {
      s = { id, kind, entities: [] };
      sections.set(id, s);
    }
    return s;
  };

  const attention: Record<string, AttentionReason> = {};
  const alerts: string[] = [];
  const batteries: string[] = [];
  const unavailable: string[] = [];

  // Low batteries live on diagnostic entities, which only `withDiagnostic` carries.
  for (const id of index.withDiagnostic) {
    if (isLowBattery(hass.states[id], threshold)) {
      batteries.push(id);
      attention[id] = "battery";
    }
  }

  for (const id of index.primary) {
    const s = hass.states[id];
    if (!s || attention[id]) continue;
    const domain = domainOf(id);
    if (SKIPPED_DOMAINS.has(domain)) continue;
    if (s.state === UNAVAILABLE && !UNAVAILABLE_IS_NORMAL.has(domain)) {
      unavailable.push(id);
      attention[id] = "unavailable";
      continue;
    }
    if (domain === "binary_sensor" && s.state === "on" && alertClasses.has(deviceClass(s) ?? "")) {
      alerts.push(id);
      attention[id] = "alert";
      continue;
    }
    const target = DOMAIN_SECTION[domain] ?? "other";
    const kind: RoomSectionKind = target === "status" ? "status" : target === "sensors" ? "stats" : "tiles";
    section(target, kind).entities.push(id);
  }

  const name = byName(hass);
  const attn = section("attention", "status");
  attn.entities = [...alerts.sort(name), ...batteries.sort(name), ...unavailable.sort(name)];
  attn.reasons = attention;

  const out: RoomSection[] = [];
  for (const id of SECTION_ORDER) {
    const sec = sections.get(id);
    if (!sec || sec.entities.length === 0) continue;
    if (id !== "attention") sortSection(hass, sec);
    out.push(sec);
  }
  return { sections: out, total: out.reduce((n, s) => n + s.entities.length, 0) };
}

// ---- Native tiles ---------------------------------------------------------

/** Things you run rather than switch: their state is "when it last ran", never on or off. */
export const RUNNABLE_SERVICE: Record<string, string> = {
  scene: "scene.turn_on",
  script: "script.turn_on",
  button: "button.press",
  input_button: "input_button.press",
};

/**
 * Native tile config for a control in the popups, with the feature that makes sense for the domain.
 * It depends on the state, so the card re-applies it when the state changes:
 *  - A light shows its brightness slider only while it's on. HA's tile has no option to hide the feature
 *    when off, and an empty slider on every light that's off reads as noise. Tap the icon to turn it on.
 *  - A scene, script or button is something you run: tapping the tile runs it (HA's own tile opens
 *    more-info), hold opens more-info. Its state line is when it last ran, or nothing if it never ran,
 *    instead of "Unknown".
 */
export function tileConfig(entity: string, s: HassEntity | undefined, name: string): Record<string, unknown> {
  const domain = domainOf(entity);
  const base = { type: "tile", entity, name };

  const service = RUNNABLE_SERVICE[domain];
  if (service) {
    const run = { action: "perform-action", perform_action: service, target: { entity_id: entity } };
    let stateLine: Record<string, unknown> = {};
    if (domain === "script") {
      // A script's state is on (running) or off; when it last ran is an attribute.
      if (s?.state === "off") stateLine = s.attributes.last_triggered ? { state_content: "last_triggered" } : { hide_state: true };
    } else if (s?.state === "unknown") {
      stateLine = { hide_state: true };
    }
    return { ...base, ...stateLine, tap_action: run, icon_tap_action: run, hold_action: { action: "more-info" } };
  }

  const features: Record<string, unknown>[] = [];
  if (domain === "light") {
    const modes = (s?.attributes.supported_color_modes as string[] | undefined) ?? [];
    if (s?.state === "on" && modes.some((m) => m !== "onoff")) features.push({ type: "light-brightness" });
  } else if (domain === "cover") {
    features.push({ type: "cover-open-close" });
  } else if (domain === "climate") {
    features.push({ type: "target-temperature" });
  } else if (domain === "media_player") {
    features.push({ type: "media-player-playback" });
  }
  return {
    ...base,
    // Inline keeps a light one row tall (slider beside the name) on Home Assistant versions that support
    // it; older ones ignore the key and draw the slider below.
    ...(features.length
      ? { features, features_position: domain === "light" || domain === "climate" ? "inline" : "bottom" }
      : {}),
  };
}

// ---- Names ----------------------------------------------------------------

export interface RoomLabel {
  name: string;
  /** Device name, only when the short name alone would be ambiguous. */
  sub?: string;
}

const capitalise = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function stripPrefix(full: string, prefix: string | undefined | null): string {
  if (!prefix) return full;
  const p = prefix.trim();
  if (!p || full.length <= p.length) return full;
  if (full.toLowerCase().startsWith(p.toLowerCase()) && /[\s:\-–]/.test(full.charAt(p.length))) {
    const rest = full.slice(p.length).replace(/^[\s:\-–]+/, "").trim();
    return rest ? capitalise(rest) : full;
  }
  return full;
}

/**
 * Short, readable names for the entities in the sheet.
 *
 * The area name is dropped everywhere ("Living Room TV" is just "TV" inside the Living Room sheet).
 * For stat cells the device name goes too ("Sonoff Temperature(LR) Humidity" becomes "Humidity"), and
 * when two cells would then read the same the device name comes back as a small second line.
 */
export function roomLabels(
  hass: HomeAssistant,
  areaId: string,
  statIds: string[],
  otherIds: string[]
): Record<string, RoomLabel> {
  const areaName = hass.areas?.[areaId]?.name;
  const deviceName = (id: string) => {
    const deviceId = hass.entities?.[id]?.device_id;
    const d = deviceId ? hass.devices?.[deviceId] : undefined;
    return d?.name_by_user ?? d?.name ?? undefined;
  };
  const labels: Record<string, RoomLabel> = {};

  for (const id of otherIds) labels[id] = { name: stripPrefix(displayName(hass, id), areaName) };

  const stats = statIds.map((id) => {
    const noArea = stripPrefix(displayName(hass, id), areaName);
    const device = deviceName(id);
    return { id, short: stripPrefix(noArea, device), noArea, device };
  });
  const counts = new Map<string, number>();
  for (const s of stats) counts.set(s.short.toLowerCase(), (counts.get(s.short.toLowerCase()) ?? 0) + 1);
  for (const s of stats) {
    const ambiguous = (counts.get(s.short.toLowerCase()) ?? 0) > 1;
    labels[s.id] = ambiguous && s.device && s.short !== s.noArea ? { name: s.short, sub: s.device } : { name: ambiguous ? s.noArea : s.short };
  }
  return labels;
}

/** Search match on what the user sees, the full friendly name and the entity id. */
export function matchesQuery(query: string, ...haystacks: (string | undefined)[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return q.split(/\s+/).every((word) => haystacks.some((h) => !!h && h.toLowerCase().includes(word)));
}
