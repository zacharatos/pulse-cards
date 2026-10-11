// Pure logic for Tile Pulse Card: no DOM, hass + config in, plain data out. Tested in test/tile.test.mjs.
import type { ActionConfig, HassEntity, HomeAssistant, StateContent, TileActionConfig, TilePulseCardConfig } from "./types";

export const domainOf = (entityId: string) => entityId.split(".")[0];

/** More buttons than this from one entity's options is a list, not a row: no automatic buttons then. */
export const MAX_AUTO_ACTIONS = 6;
export const DEFAULT_COLUMNS = 4;
export const DEFAULT_STATE_CONTENT: StateContent[] = ["state", "last_changed"];

const UNAVAILABLE = new Set(["unavailable", "unknown"]);

/** States that mean "nothing going on": the icon stays neutral and `hide_actions_when_off` hides the row. */
const OFF_STATES = new Set([
  "off",
  "unavailable",
  "unknown",
  "closed",
  "locked",
  "idle",
  "standby",
  "not_home",
  "docked",
  "disarmed",
]);

/** Domains whose state is a value, not on/off: never tinted as "on". */
const VALUE_DOMAINS = new Set(["sensor", "select", "input_select", "input_number", "input_text", "number", "text", "weather", "sun", "event", "date", "datetime", "time", "button", "input_button", "scene", "script"]);

export const isUnavailable = (s?: HassEntity) => !s || UNAVAILABLE.has(s.state);

/** The entity is on, open, running, playing...: its icon takes the state colour. */
export function isActive(s?: HassEntity): boolean {
  if (!s || OFF_STATES.has(s.state)) return false;
  return !VALUE_DOMAINS.has(domainOf(s.entity_id));
}

/** The entity is off or unavailable (for `hide_actions_when_off`). Value entities count as on while they have a value. */
export function isOff(s?: HassEntity): boolean {
  if (!s || UNAVAILABLE.has(s.state)) return true;
  if (VALUE_DOMAINS.has(domainOf(s.entity_id))) return false;
  return OFF_STATES.has(s.state);
}

// ---- Options ----------------------------------------------------------------------------------------

/** Where an entity keeps its options and how one is set. `hvac` and `preset` are the climate's two lists. */
interface OptionKind {
  list: (s: HassEntity) => string[] | undefined;
  current: (s: HassEntity) => string | null | undefined;
  /** The attribute the current option lives in (for HA's attribute formatting); undefined when it is the state. */
  attribute?: string;
  service: string;
  field: string;
}

const OPTION_KINDS: Record<string, OptionKind> = {
  select: { list: (s) => s.attributes.options, current: (s) => s.state, service: "select.select_option", field: "option" },
  input_select: { list: (s) => s.attributes.options, current: (s) => s.state, service: "input_select.select_option", field: "option" },
  fan: { list: (s) => s.attributes.preset_modes, current: (s) => s.attributes.preset_mode, attribute: "preset_mode", service: "fan.set_preset_mode", field: "preset_mode" },
  climate: { list: (s) => s.attributes.hvac_modes, current: (s) => s.state, service: "climate.set_hvac_mode", field: "hvac_mode" },
  humidifier: { list: (s) => s.attributes.available_modes, current: (s) => s.attributes.mode, attribute: "mode", service: "humidifier.set_mode", field: "mode" },
  water_heater: { list: (s) => s.attributes.operation_list, current: (s) => s.state, service: "water_heater.set_operation_mode", field: "operation_mode" },
  media_player: { list: (s) => s.attributes.source_list, current: (s) => s.attributes.source, attribute: "source", service: "media_player.select_source", field: "source" },
};

const CLIMATE_PRESET: OptionKind = {
  list: (s) => s.attributes.preset_modes,
  current: (s) => s.attributes.preset_mode,
  attribute: "preset_mode",
  service: "climate.set_preset_mode",
  field: "preset_mode",
};

/** The option list an option belongs to. A climate option is an HVAC mode, or else a preset. */
function kindFor(s: HassEntity, option?: string): OptionKind | undefined {
  const kind = OPTION_KINDS[domainOf(s.entity_id)];
  if (!kind) return undefined;
  if (domainOf(s.entity_id) === "climate" && option !== undefined && !(kind.list(s) ?? []).includes(option)) {
    if ((CLIMATE_PRESET.list(s) ?? []).includes(option)) return CLIMATE_PRESET;
  }
  return kind;
}

/** The options an entity offers as buttons (select options, fan presets, climate HVAC modes...). */
export function optionsOf(s?: HassEntity): string[] {
  if (!s) return [];
  const list = kindFor(s)?.list(s);
  return Array.isArray(list) ? list.filter((o) => typeof o === "string") : [];
}

/** Does this entity's domain take options at all? */
export const takesOptions = (entityId: string) => domainOf(entityId) in OPTION_KINDS;

/** The entity is on this option right now. */
export function optionActive(s: HassEntity | undefined, option: string): boolean {
  if (!s || isUnavailable(s)) return false;
  const kind = kindFor(s, option);
  return !!kind && kind.current(s) === option;
}

/** The action that sets the option, handed to HA's own action handler. */
export function optionAction(entityId: string, s: HassEntity | undefined, option: string): ActionConfig {
  const kind = (s && kindFor(s, option)) ?? OPTION_KINDS[domainOf(entityId)] ?? OPTION_KINDS.select;
  return {
    action: "perform-action",
    perform_action: kind.service,
    target: { entity_id: entityId },
    data: { [kind.field]: option },
  };
}

/** "fan_only" → "Fan only". */
export function prettify(value: string): string {
  const v = value.replace(/_/g, " ").trim();
  return v.charAt(0).toUpperCase() + v.slice(1);
}

/** The option as Home Assistant shows it (translated where the integration translates it). */
export function optionLabel(hass: HomeAssistant | undefined, s: HassEntity | undefined, option: string): string {
  if (s && hass) {
    const kind = kindFor(s, option);
    try {
      const label = kind?.attribute
        ? hass.formatEntityAttributeValue?.(s, kind.attribute, option)
        : hass.formatEntityState?.(s, option);
      if (label) return label;
    } catch {
      /* older frontends: fall through */
    }
  }
  return prettify(option);
}

/** Icons for common modes, in English and Greek. Falls back to a neutral "tune" icon. */
const OPTION_ICONS: [RegExp, string][] = [
  [/sleep|night|ύπνο|νύχτ|βράδ/i, "mdi:power-sleep"],
  [/^off$|κλειστ|σβηστ/i, "mdi:power"],
  [/turbo|boost|max|full|ενισχ|μέγιστ/i, "mdi:rocket-launch-outline"],
  [/auto|smart|αυτόματ/i, "mdi:fan-auto"],
  [/manual|favou?rite|custom|χειροκίνητ|αγαπημ/i, "mdi:hand-back-right-outline"],
  [/silent|quiet|σιγ|αθόρυβ/i, "mdi:volume-off"],
  [/^low$|^1$|χαμηλ/i, "mdi:fan-speed-1"],
  [/medium|middle|^mid$|^2$|μεσαί/i, "mdi:fan-speed-2"],
  [/^high$|^3$|υψηλ/i, "mdi:fan-speed-3"],
  [/eco|leaf|οικολ/i, "mdi:leaf"],
  [/heat_cool|heat-cool/i, "mdi:sun-snowflake-variant"],
  [/heat|warm|θέρμ|ζεστ/i, "mdi:fire"],
  [/cool|cold|ψύξ|δροσ/i, "mdi:snowflake"],
  [/dry|αφύγρ|ξηρ/i, "mdi:water-percent"],
  [/fan|ανεμ/i, "mdi:fan"],
  [/away|έξω|απουσ/i, "mdi:home-export-outline"],
  [/home|σπίτι/i, "mdi:home-outline"],
  [/comfort|άνεσ/i, "mdi:sofa-outline"],
  [/baby|child|παιδ|μωρ/i, "mdi:baby-face-outline"],
  [/pet|κατοικ/i, "mdi:paw"],
  [/tv|τηλεόρ/i, "mdi:television"],
  [/music|μουσικ/i, "mdi:music"],
];

export function guessOptionIcon(option: string): string {
  for (const [re, icon] of OPTION_ICONS) if (re.test(option)) return icon;
  return "mdi:tune-variant";
}

// ---- Discovery --------------------------------------------------------------------------------------

const usable = (n: number) => n >= 2 && n <= MAX_AUTO_ACTIONS;

/**
 * The entity whose options the buttons set, when the config does not name one:
 * the main entity itself if it has 2–6 options (a fan's presets, a climate's modes, a select),
 * else the one select / input_select on the same device (a "mode" one wins if there are several).
 */
export function discoverActionEntity(hass: HomeAssistant, config: TilePulseCardConfig): string | undefined {
  if (config.action_entity) return config.action_entity === "none" ? undefined : config.action_entity;
  const main = hass.states[config.entity];
  if (main && usable(optionsOf(main).length)) return config.entity;
  const deviceId = hass.entities[config.entity]?.device_id;
  if (!deviceId) return undefined;
  const candidates = Object.values(hass.entities).filter((e) => {
    if (e.device_id !== deviceId || e.entity_id === config.entity || e.hidden || e.entity_category === "diagnostic") return false;
    const d = domainOf(e.entity_id);
    return (d === "select" || d === "input_select") && usable(optionsOf(hass.states[e.entity_id]).length);
  });
  if (candidates.length === 1) return candidates[0].entity_id;
  const modes = candidates.filter((e) => /mode|preset|λειτουργ/i.test(`${e.entity_id} ${e.name ?? ""}`));
  return modes.length === 1 ? modes[0].entity_id : undefined;
}

// ---- Buttons ----------------------------------------------------------------------------------------

export interface ResolvedAction {
  key: string;
  name: string;
  icon: string;
  /** The entity the button works on (its state lights it and, unavailable, disables it). */
  entity?: string;
  option?: string;
  color?: string;
  tap_action: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  active: boolean;
  disabled: boolean;
}

/** Domains a plain button runs rather than toggles. */
const RUN_SERVICES: Record<string, string> = {
  scene: "scene.turn_on",
  script: "script.turn_on",
  button: "button.press",
  input_button: "input_button.press",
};

/** Domains HA can toggle and that are safe to toggle from one tap (no locks, covers, valves, alarms). */
const TOGGLE_DOMAINS = new Set([
  "light",
  "switch",
  "fan",
  "input_boolean",
  "automation",
  "humidifier",
  "siren",
  "media_player",
  "climate",
  "remote",
  "group",
]);

export const canToggle = (entityId: string) => TOGGLE_DOMAINS.has(domainOf(entityId));

/** What a plain entity button does: run scenes, scripts and buttons, toggle the rest that can be, else more-info. */
export function entityAction(entityId: string): ActionConfig {
  const run = RUN_SERVICES[domainOf(entityId)];
  if (run) return { action: "perform-action", perform_action: run, target: { entity_id: entityId } };
  return canToggle(entityId) ? { action: "toggle" } : { action: "more-info" };
}

/** The tap on the main icon when the config doesn't say: toggle when that is safe, else more-info (like the native tile). */
export function defaultIconTap(entityId: string): ActionConfig {
  return canToggle(entityId) ? { action: "toggle" } : { action: "more-info" };
}

/**
 * The buttons to draw. Explicit `actions` win (an empty list draws none); without them, one button per
 * option of the action entity. Each button knows whether it is lit and whether its entity is unavailable.
 */
export function resolveActions(
  hass: HomeAssistant,
  config: TilePulseCardConfig,
  actionEntity: string | undefined
): ResolvedAction[] {
  if (Array.isArray(config.actions)) {
    return config.actions.map((a, i) => resolveOne(hass, a, actionEntity ?? config.entity, i));
  }
  if (!actionEntity) return [];
  const s = hass.states[actionEntity];
  const options = optionsOf(s);
  if (!usable(options.length)) return [];
  return options.map((option, i) => resolveOne(hass, { option }, actionEntity, i));
}

function resolveOne(hass: HomeAssistant, a: TileActionConfig, defaultTarget: string, i: number): ResolvedAction {
  const hasOption = a.option !== undefined && a.option !== null && a.option !== "";
  const option = hasOption ? String(a.option) : undefined;
  const entity = a.entity ?? (hasOption ? defaultTarget : undefined);
  const s = entity ? hass.states[entity] : undefined;

  let tap: ActionConfig;
  if (a.tap_action) tap = a.tap_action;
  else if (entity && option !== undefined) tap = optionAction(entity, s, option);
  else if (entity) tap = entityAction(entity);
  else tap = { action: "none" };

  const active = !!entity && (option !== undefined ? optionActive(s, option) : RUN_SERVICES[domainOf(entity)] ? false : isActive(s));
  const fallbackName = option !== undefined ? optionLabel(hass, s, option) : s ? String(s.attributes.friendly_name ?? entity) : "";
  const fallbackIcon = option !== undefined ? guessOptionIcon(option) : s?.attributes.icon ?? (entity ? "" : "mdi:gesture-tap-button");

  return {
    key: `${i}:${entity ?? ""}:${option ?? ""}`,
    name: a.name ?? fallbackName,
    icon: a.icon ?? fallbackIcon,
    entity,
    option,
    color: a.color,
    tap_action: tap,
    // Hold opens the entity's dialog unless told otherwise: the way to see why a mode didn't change.
    hold_action: a.hold_action ?? (entity ? { action: "more-info" } : undefined),
    double_tap_action: a.double_tap_action,
    active,
    disabled: !!entity && isUnavailable(s),
  };
}

/**
 * While a tap is on its way, show the tapped option as the lit one (and its siblings on the same entity
 * as not lit), so the row answers at once. `pending` maps entity → option.
 */
export function withPending(actions: ResolvedAction[], pending: Map<string, string>): ResolvedAction[] {
  if (!pending.size) return actions;
  return actions.map((a) => {
    if (!a.entity || a.option === undefined || !pending.has(a.entity)) return a;
    return { ...a, active: pending.get(a.entity) === a.option };
  });
}

// ---- The line under the name ------------------------------------------------------------------------

export type ContentPart =
  | { kind: "text"; value: string }
  | { kind: "time"; value: string };

export function stateContentList(config: TilePulseCardConfig): StateContent[] {
  const c = config.state_content;
  if (c === undefined || c === null) return DEFAULT_STATE_CONTENT;
  return (Array.isArray(c) ? c : [c]).filter((x) => typeof x === "string" && x !== "");
}

const isEntityId = (v: string) => /^[a-z_]+\.[a-z0-9_]+$/.test(v);

/**
 * The parts of the line under the name, in order. `state` and attributes are formatted by Home Assistant,
 * times are returned raw (the card turns them into "3 minutes ago"), entity ids show that entity's state.
 * Empty parts are left out. Unavailable shows only the state.
 */
export function contentParts(hass: HomeAssistant, s: HassEntity | undefined, content: StateContent[]): ContentPart[] {
  if (!s) return [];
  if (isUnavailable(s)) return [{ kind: "text", value: formatState(hass, s) }];
  const parts: ContentPart[] = [];
  for (const c of content) {
    if (c === "state") parts.push({ kind: "text", value: formatState(hass, s) });
    else if (c === "last_changed" || c === "last-changed") parts.push({ kind: "time", value: s.last_changed });
    else if (c === "last_updated" || c === "last-updated") parts.push({ kind: "time", value: s.last_updated });
    else if (isEntityId(c)) {
      const other = hass.states[c];
      if (other && !isUnavailable(other)) parts.push({ kind: "text", value: formatState(hass, other) });
    } else if (s.attributes[c] !== undefined && s.attributes[c] !== null) {
      const v = s.attributes[c];
      const formatted = hass.formatEntityAttributeValue?.(s, c, v) ?? String(v);
      parts.push({ kind: "text", value: formatted });
    }
  }
  return parts.filter((p) => p.value !== "");
}

export function formatState(hass: HomeAssistant | undefined, s: HassEntity): string {
  try {
    const f = hass?.formatEntityState?.(s);
    if (f) return f;
  } catch {
    /* fall through */
  }
  const unit = s.attributes.unit_of_measurement;
  return unit ? `${s.state} ${unit}` : prettify(s.state);
}

// ---- Helpers ----------------------------------------------------------------------------------------

/** Entities whose changes re-render the card. */
export function watchedEntities(config: TilePulseCardConfig, actionEntity: string | undefined): Set<string> {
  const ids = new Set<string>();
  if (config.entity) ids.add(config.entity);
  if (actionEntity) ids.add(actionEntity);
  for (const a of config.actions ?? []) if (a?.entity) ids.add(a.entity);
  for (const c of stateContentList(config)) if (isEntityId(c)) ids.add(c);
  return ids;
}

/** Rows of buttons: 7 on 4 columns → 4 + 3, 5 → 3 + 2. Same as Home Pulse Shortcuts. */
export function balanceRows(n: number, cols: number): number[] {
  if (n <= 0) return [];
  const c = Math.max(1, Math.floor(cols));
  const rows = Math.ceil(n / c);
  const base = Math.floor(n / rows);
  const extra = n % rows;
  return Array.from({ length: rows }, (_, i) => base + (i < extra ? 1 : 0));
}

/** A HA colour name (`amber`) or any CSS colour. Same as the other Pulse cards. */
export function cssColor(color: string): string {
  if (/^(#|rgb|hsl|var\()/i.test(color)) return color;
  if (color === "primary" || color === "accent") return `var(--${color}-color)`;
  return `var(--${color}-color, ${color})`;
}

/** The main icon's colour while on: the config's colour, else Home Assistant's state colour for it. */
export function stateColor(s: HassEntity, color?: string): string {
  if (color) return cssColor(color);
  const d = domainOf(s.entity_id);
  const st = s.state.replace(/[^a-z0-9_]/gi, "_");
  return `var(--state-${d}-${st}-color, var(--state-${d}-active-color, var(--state-active-color, var(--tpc-active))))`;
}
