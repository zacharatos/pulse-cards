// Pure card logic: hass + config in, plain data out. No DOM, so it runs under `node --test`.

import type { GroupBy, HassEntity, HomeAssistant, ScenePulseCardConfig, SceneConfig } from "./types";

export const DOMAIN = "scene";

/** The scene the card keeps for "Undo". Never shown in the card. */
export const UNDO_SCENE_ID = "scene_pulse_undo";
export const UNDO_ENTITY = `${DOMAIN}.${UNDO_SCENE_ID}`;

/** After a scene runs, its lights may take this long to settle before a change counts as "someone changed it". */
export const SETTLE_MS = 15_000;

export type Status = "active" | "idle" | "unavailable";

export interface Row {
  entity_id: string;
  name: string;
  status: Status;
  /** How "active" was decided: by comparing the stored targets, or because nothing changed since it ran. */
  activeBy?: "targets" | "untouched";
  /** ISO time of the last run, if any. */
  last?: string;
  /** Config id: links to the editor; needed for "Update from now". */
  id?: string;
  /** The entities the scene sets. */
  members: string[];
  confirm: boolean;
  /** True when the scene carries a label named like the current house mode. */
  forMode: boolean;
}

export interface Group {
  key: string;
  /** Section title; empty for the single ungrouped list. */
  title: string;
  rows: Row[];
}

export const asList = (v: string | string[] | undefined): string[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

export const isScene = (id: string) => id.startsWith(`${DOMAIN}.`);
const domainOf = (id: string) => id.split(".")[0];
/** Our own undo scene and its siblings never show up. */
const isOurs = (id: string) => id.startsWith(`${DOMAIN}.scene_pulse_`);

export function displayName(hass: HomeAssistant, id: string): string {
  const s = hass.states[id];
  return String(hass.entities[id]?.name || s?.attributes.friendly_name || id.split(".")[1]?.replace(/_/g, " ") || id);
}

const byName = (hass: HomeAssistant) => (a: string, b: string) =>
  displayName(hass, a).localeCompare(displayName(hass, b), undefined, { sensitivity: "base", numeric: true });

/**
 * The scenes the card shows, in order. Explicit `entities` first, in their order; then every scene carrying
 * one of the labels, by name. With neither, every visible scene in the house, by name. `exclude` applies to
 * all of it. Filtering happens only here, so everything downstream sees one set.
 */
export function selectScenes(hass: HomeAssistant, config: ScenePulseCardConfig): string[] {
  const exclude = new Set(config.exclude ?? []);
  const keep = (id: string) => isScene(id) && !exclude.has(id) && !isOurs(id);
  const explicit = (config.entities ?? []).filter(keep);
  const labels = asList(config.label);
  const seen = new Set(explicit);
  const all = Object.keys(hass.states).filter((id) => keep(id) && !seen.has(id));
  let extra: string[];
  if (labels.length) {
    extra = all.filter((id) => (hass.entities[id]?.labels ?? []).some((l) => labels.includes(l)));
  } else if (!explicit.length) {
    extra = all.filter((id) => !hass.entities[id]?.hidden);
  } else {
    extra = [];
  }
  return [...new Set([...explicit, ...extra.sort(byName(hass))])];
}

export const isUnavailable = (s?: HassEntity) => !s || s.state === "unavailable";

/** When the scene last ran, or undefined when it never did. */
export function lastRun(s?: HassEntity): string | undefined {
  if (!s) return undefined;
  return Number.isNaN(Date.parse(s.state)) ? undefined : s.state;
}

export const membersOf = (s?: HassEntity): string[] => (Array.isArray(s?.attributes.entity_id) ? s!.attributes.entity_id : []);

// ---- "Active now" ---------------------------------------------------------------------------------------

/** Attributes worth comparing, with how far apart two values may be and still match. */
const TOLERANCE: Record<string, number> = {
  brightness: 5,
  color_temp_kelvin: 150,
  current_position: 3,
  current_tilt_position: 3,
  percentage: 3,
  temperature: 0.1,
  target_temp_low: 0.1,
  target_temp_high: 0.1,
  volume_level: 0.03,
};
const EXACT = ["preset_mode", "hvac_mode", "fan_mode", "swing_mode", "option", "source"];

/** States that mean the same thing for "does the house look like the scene?" (a cover still moving counts). */
function sameState(domain: string, want: string, have: string): boolean {
  if (want === have) return true;
  if (domain === "cover") return (want === "open" && have === "opening") || (want === "closed" && have === "closing");
  return false;
}

/** Does one entity look the way the scene wants it? Only the state and the attributes we can compare reliably count. */
export function entityMatches(id: string, target: Record<string, unknown> & { state?: string }, s?: HassEntity): boolean {
  if (!s || s.state === "unavailable" || s.state === "unknown") return false;
  const domain = domainOf(id);
  if (target.state !== undefined && !sameState(domain, String(target.state), s.state)) return false;
  // Attributes of something off don't matter (a light that is off has no brightness).
  if (target.state === "off" || s.state === "off") return true;
  for (const [key, tol] of Object.entries(TOLERANCE)) {
    const want = target[key];
    if (typeof want !== "number") continue;
    // Colour temperature only counts when the scene stored a colour-temperature light.
    if (key === "color_temp_kelvin" && target.color_mode !== undefined && target.color_mode !== "color_temp") continue;
    const have = s.attributes[key];
    if (typeof have !== "number" || Math.abs(have - want) > tol) return false;
  }
  for (const key of EXACT) {
    const want = target[key];
    if (typeof want !== "string") continue;
    if (s.attributes[key] !== want) return false;
  }
  return true;
}

/** Every entity of the stored scene looks the way the scene wants it. */
export function matchesTargets(hass: HomeAssistant, config: SceneConfig): boolean {
  const entries = Object.entries(config.entities ?? {});
  if (!entries.length) return false;
  return entries.every(([id, target]) => entityMatches(id, target ?? {}, hass.states[id]));
}

/** Domains whose attributes change when someone adjusts them (dimming, moving a blind), not only their state. */
const ATTRIBUTE_DOMAINS = new Set(["light", "cover", "fan", "climate", "media_player"]);

/**
 * Without the stored targets (scenes from YAML, or a user who isn't an admin): the scene still holds when it
 * ran last of all the shown scenes and nothing it sets changed since it settled.
 */
export function untouchedSince(hass: HomeAssistant, s: HassEntity, settleMs = SETTLE_MS): boolean {
  const ran = Date.parse(s.state);
  if (Number.isNaN(ran)) return false;
  const members = membersOf(s);
  if (!members.length) return false;
  return members.every((id) => {
    const m = hass.states[id];
    if (!m || m.state === "unavailable") return false;
    const changed = Date.parse(ATTRIBUTE_DOMAINS.has(domainOf(id)) ? m.last_updated : m.last_changed);
    return Number.isNaN(changed) || changed <= ran + settleMs;
  });
}

// ---- House mode -----------------------------------------------------------------------------------------

/**
 * The house mode selector: the configured one, or a visible input_select/select called house_mode or
 * home_mode, the same rule as Home Pulse Card's modes row. Nothing else is guessed.
 */
export function discoverModeEntity(hass: HomeAssistant, config: ScenePulseCardConfig): string | undefined {
  if (config.mode_entity === "none") return undefined;
  if (config.mode_entity) return config.mode_entity;
  return Object.keys(hass.states).find(
    (id) =>
      (domainOf(id) === "input_select" || domainOf(id) === "select") &&
      /(^|\.|_)(house|home)_mode$/.test(id) &&
      !hass.entities?.[id]?.hidden
  );
}

/** Lower case, no accents, no spaces: "Νύχτα" and "νυχτα", "Movie night" and "movie_night" are equal. */
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

/** The label ids that stand for this mode: a label whose name (or id) reads like the mode's option. */
export function modeLabelIds(mode: string | undefined, labelNames: Record<string, string>): Set<string> {
  const out = new Set<string>();
  if (!mode) return out;
  const want = normalize(mode);
  if (!want) return out;
  for (const [id, name] of Object.entries(labelNames)) if (normalize(name) === want) out.add(id);
  // Label ids are made from the name when the label is created, so they still match without the names.
  out.add(want);
  return out;
}

/** The current house mode, if there is a selector and it holds a real option. */
export function currentMode(hass: HomeAssistant, modeEntity: string | undefined): string | undefined {
  const s = modeEntity ? hass.states[modeEntity] : undefined;
  if (!s || s.state === "unavailable" || s.state === "unknown") return undefined;
  return s.state;
}

// ---- Rows and groups ------------------------------------------------------------------------------------

export interface RowSources {
  /** Stored scene configs by config id (admins only). */
  configs: Map<string, SceneConfig>;
  /** Label ids that stand for the current house mode. */
  modeLabels: Set<string>;
}

export function buildRows(hass: HomeAssistant, config: ScenePulseCardConfig, ids: string[], src: RowSources): Row[] {
  const confirm = new Set(config.confirm ?? []);
  const normalizedModeLabels = new Set([...src.modeLabels].map(normalize));
  const rows: Row[] = ids.map((entity_id) => {
    const s = hass.states[entity_id];
    const id = s?.attributes.id ? String(s.attributes.id) : undefined;
    const labels = hass.entities[entity_id]?.labels ?? [];
    return {
      entity_id,
      name: displayName(hass, entity_id),
      status: isUnavailable(s) ? "unavailable" : "idle",
      last: lastRun(s),
      id,
      members: membersOf(s),
      confirm: confirm.has(entity_id),
      forMode: labels.some((l) => src.modeLabels.has(l) || normalizedModeLabels.has(normalize(l))),
    };
  });
  // Active: compared with the stored targets where we have them; otherwise only the scene that ran last
  // of all the shown ones can still hold, and only while nothing it sets has changed.
  const latest = rows
    .filter((r) => r.last && r.status !== "unavailable")
    .sort((a, b) => Date.parse(b.last!) - Date.parse(a.last!))[0];
  for (const r of rows) {
    if (r.status === "unavailable") continue;
    const stored = r.id ? src.configs.get(r.id) : undefined;
    if (stored) {
      if (matchesTargets(hass, stored)) {
        r.status = "active";
        r.activeBy = "targets";
      }
    } else if (r === latest && untouchedSince(hass, hass.states[r.entity_id], SETTLE_MS + transitionMs(config))) {
      r.status = "active";
      r.activeBy = "untouched";
    }
  }
  return rows;
}

export const transitionMs = (config: ScenePulseCardConfig) => Math.max(0, Number(config.transition ?? 0)) * 1000;

export interface GroupSources {
  labelNames?: Record<string, string>;
  /** Title for scenes that fit no group. */
  other: string;
  /** Title of the section for the current mode's scenes, e.g. "For Night". */
  modeTitle?: string;
  /** Title for everything else when only the mode section has a title. */
  rest: string;
}

/**
 * Split rows into titled sections. The current mode's scenes come first, in their own section; the rest are
 * grouped by area or label (sorted by title, "other" last), or stay one list. Rows keep their order inside a
 * section. Labels used to *select* scenes, and the mode's own labels, are skipped when grouping by label.
 */
export function groupRows(
  hass: HomeAssistant,
  config: ScenePulseCardConfig,
  rows: Row[],
  by: GroupBy,
  src: GroupSources,
  modeLabels: Set<string> = new Set()
): Group[] {
  const pinned = src.modeTitle ? rows.filter((r) => r.forMode) : [];
  const rest = pinned.length ? rows.filter((r) => !r.forMode) : rows;
  const head: Group[] = pinned.length ? [{ key: "__mode", title: src.modeTitle!, rows: pinned }] : [];
  if (!rest.length) return head.length ? head : [{ key: "", title: "", rows }];

  let groups: Group[];
  if (by === "none") {
    groups = [{ key: "", title: "", rows: rest }];
  } else {
    const skip = new Set([...asList(config.label), ...modeLabels]);
    const keyOf = (r: Row): { key: string; title: string } | undefined => {
      const reg = hass.entities[r.entity_id];
      if (by === "area") {
        const area = reg?.area_id;
        return area ? { key: area, title: hass.areas?.[area]?.name ?? area } : undefined;
      }
      const names = src.labelNames ?? {};
      return (reg?.labels ?? [])
        .filter((l) => !skip.has(l))
        .map((l) => ({ key: l, title: names[l] ?? l }))
        .sort((a, b) => a.title.localeCompare(b.title))[0];
    };
    const map = new Map<string, Group>();
    const other: Group = { key: "__other", title: src.other, rows: [] };
    for (const r of rest) {
      const k = keyOf(r);
      if (!k) {
        other.rows.push(r);
        continue;
      }
      if (!map.has(k.key)) map.set(k.key, { key: k.key, title: k.title, rows: [] });
      map.get(k.key)!.rows.push(r);
    }
    groups = [...map.values()].sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
    if (other.rows.length) groups.push(other);
    // One section only: a title adds nothing (unless the mode section sits above it).
    if (groups.length === 1) groups = [{ key: "", title: "", rows: groups[0].rows }];
  }
  // Under a titled mode section, an untitled rest needs a title too.
  if (head.length && groups.length === 1 && !groups[0].title) groups[0] = { ...groups[0], key: "__rest", title: src.rest };
  return [...head, ...groups];
}

// ---- Menu -----------------------------------------------------------------------------------------------

export type MenuKey = "run" | "undo" | "show" | "update" | "edit" | "more_info";

/** Which menu entries a row offers. */
export function menuFor(row: Row, opts: { admin: boolean; canUndo: boolean; hasConfig: boolean }): MenuKey[] {
  const out: MenuKey[] = [];
  if (row.status !== "unavailable") out.push("run");
  if (opts.canUndo) out.push("undo");
  if (row.members.length || opts.hasConfig) out.push("show");
  if (opts.admin && row.id && opts.hasConfig) out.push("update");
  if (opts.admin && row.id) out.push("edit");
  out.push("more_info");
  return out;
}

// ---- Undo and "Update from now" -------------------------------------------------------------------------

/** The `scene.create` call that remembers the scene's entities as they are now, so Undo can put them back. */
export function undoSnapshot(members: string[]): { scene_id: string; snapshot_entities: string[] } | undefined {
  const ids = members.filter((id) => !isScene(id));
  return ids.length ? { scene_id: UNDO_SCENE_ID, snapshot_entities: ids } : undefined;
}

/** Attributes that describe an entity rather than its state: never written into a scene. */
const NOT_STATE = new Set([
  "friendly_name",
  "icon",
  "entity_picture",
  "supported_features",
  "supported_color_modes",
  "attribution",
  "device_class",
  "unit_of_measurement",
  "restored",
  "editable",
  "id",
  "min_color_temp_kelvin",
  "max_color_temp_kelvin",
  "min_mireds",
  "max_mireds",
  "effect_list",
  "preset_modes",
  "hvac_modes",
  "fan_modes",
  "swing_modes",
  "source_list",
  "sound_mode_list",
  "options",
  "min_temp",
  "max_temp",
  "target_temp_step",
]);

/**
 * The scene's stored config with every entity re-captured from how it is right now. Everything else in the
 * config (name, icon, metadata) stays. Entities that are missing or unavailable keep their old target.
 */
export function recapture(hass: HomeAssistant, config: SceneConfig): SceneConfig {
  const entities: SceneConfig["entities"] = {};
  for (const [id, old] of Object.entries(config.entities ?? {})) {
    const s = hass.states[id];
    if (!s || s.state === "unavailable" || s.state === "unknown") {
      entities[id] = old;
      continue;
    }
    const attrs: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(s.attributes)) if (!NOT_STATE.has(k)) attrs[k] = v;
    entities[id] = { ...attrs, state: s.state };
  }
  return { ...config, entities };
}

// ---- "What it sets" -------------------------------------------------------------------------------------

export interface TargetLine {
  entity_id: string;
  /** The wanted state, raw (the card localises it). */
  state?: string;
  /** A short extra, e.g. "60%" or "21°". */
  extra?: string;
  /** Whether it already looks like that. */
  matches?: boolean;
}

/** One line per entity the scene sets, with the target when the stored config is known. */
export function targetLines(hass: HomeAssistant, members: string[], config?: SceneConfig): TargetLine[] {
  const ids = config ? Object.keys(config.entities ?? {}) : members;
  return ids.map((id) => {
    const t = config?.entities?.[id];
    if (!t) return { entity_id: id };
    const domain = domainOf(id);
    let extra: string | undefined;
    if (t.state !== "off") {
      if (domain === "light" && typeof t.brightness === "number") extra = `${Math.round((t.brightness / 255) * 100)}%`;
      else if (domain === "cover" && typeof t.current_position === "number") extra = `${t.current_position}%`;
      else if (domain === "fan" && typeof t.percentage === "number") extra = `${t.percentage}%`;
      else if (domain === "climate" && typeof t.temperature === "number") extra = `${t.temperature}°`;
      else if (domain === "media_player" && typeof t.volume_level === "number") extra = `${Math.round(t.volume_level * 100)}%`;
    }
    return { entity_id: id, state: t.state === undefined ? undefined : String(t.state), extra, matches: entityMatches(id, t, hass.states[id]) };
  });
}

// ---- Misc -----------------------------------------------------------------------------------------------

/** The entity ids whose changes re-render the card: the scenes, what they set, and the mode selector. */
export function watched(hass: HomeAssistant, ids: string[], configs: Map<string, SceneConfig>, modeEntity?: string): Set<string> {
  const out = new Set<string>(ids);
  for (const id of ids) {
    const s = hass.states[id];
    for (const m of membersOf(s)) out.add(m);
    const c = s?.attributes.id ? configs.get(String(s.attributes.id)) : undefined;
    for (const m of Object.keys(c?.entities ?? {})) out.add(m);
  }
  if (modeEntity) out.add(modeEntity);
  return out;
}

/** When the card opens from the picker: the four most recently run scenes. */
export function stubEntities(hass: HomeAssistant | undefined, n = 4): string[] {
  if (!hass) return [];
  const t = (s: HassEntity) => Date.parse(s.state) || 0;
  return Object.values(hass.states)
    .filter((s) => isScene(s.entity_id) && !isOurs(s.entity_id) && !hass.entities?.[s.entity_id]?.hidden)
    .sort((a, b) => t(b) - t(a))
    .slice(0, n)
    .map((s) => s.entity_id);
}
