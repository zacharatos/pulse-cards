// Minimal Home Assistant frontend types used by the card.
// Kept local so the card has no dependency on custom-card-helpers (same as the other Pulse cards).

export interface HassEntityAttributes {
  friendly_name?: string;
  device_class?: string;
  unit_of_measurement?: string;
  icon?: string;
  entity_picture?: string;
  options?: string[];
  preset_mode?: string | null;
  preset_modes?: string[];
  hvac_modes?: string[];
  mode?: string | null;
  available_modes?: string[];
  operation_list?: string[];
  source?: string | null;
  source_list?: string[];
  /** number / input_number range. */
  min?: number;
  max?: number;
  step?: number;
  [key: string]: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributes;
  last_changed: string;
  last_updated: string;
}

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  name?: string | null;
  device_id?: string | null;
  area_id?: string | null;
  hidden?: boolean;
  entity_category?: "config" | "diagnostic" | null;
  labels?: string[];
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices?: Record<string, unknown>;
  language: string;
  locale?: { language: string; time_zone?: string; time_format?: string };
  themes?: { darkMode?: boolean };
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<unknown>;
  formatEntityState?: (stateObj: HassEntity, state?: string) => string;
  formatEntityAttributeValue?: (stateObj: HassEntity, attribute: string, value?: unknown) => string;
  formatEntityAttributeName?: (stateObj: HassEntity, attribute: string) => string;
}

/** Native Home Assistant action config (subset). Passed through untouched to HA. */
export interface ActionConfig {
  action:
    | "none"
    | "toggle"
    | "more-info"
    | "navigate"
    | "url"
    | "perform-action"
    | "call-service"
    | "assist"
    | "fire-dom-event";
  navigation_path?: string;
  url_path?: string;
  perform_action?: string;
  service?: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  entity?: string;
  confirmation?: boolean | { text?: string };
  [key: string]: unknown;
}

/** One button in the row under the tile. */
export interface TileActionConfig {
  name?: string;
  icon?: string;
  /**
   * The entity this button works on. Default: the card's `action_entity` (or the one it found) when
   * `option` is set. Without `option`, the button toggles, runs or presses it.
   */
  entity?: string;
  /**
   * An option to set on the entity: a select / input_select option, a fan preset, a climate HVAC mode or
   * preset, a humidifier mode, a water heater operation mode, a media player source, or a number /
   * input_number value. The button is lit while the entity is on that option.
   */
  option?: string;
  /** Icon colour while the button is lit: HA colour name (`amber`, `blue`, ...) or any CSS colour. */
  color?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

/** A further row of buttons under the first one, with its own options entity. */
export interface TileButtonRowConfig {
  /**
   * The entity whose options become this row's buttons when `actions` is not set, and the default target of
   * its buttons with an `option` (a purifier's fan level next to its mode).
   */
  action_entity?: string;
  /** This row's buttons. Omitted: one per option of `action_entity`. */
  actions?: TileActionConfig[];
  /** Buttons per line in this row (default: the card's `columns`). */
  columns?: number;
}

/** What the line under the name shows: `state`, `last_changed`, `last_updated`, an attribute, or an entity id. */
export type StateContent = string;

export interface TilePulseCardConfig {
  type: string;
  /** The main entity, drawn like a tile. */
  entity: string;
  name?: string;
  icon?: string;
  /** Icon colour while the main entity is on. Default: Home Assistant's state colour for it. */
  color?: string;
  /** Icon above the name, centred (default true). `false` draws it like a native tile: icon left, text right. */
  vertical?: boolean;
  /** The line under the name, in order. Default: state and when it last changed. */
  state_content?: StateContent | StateContent[];
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  /** Tap on the icon. Default: toggle when the entity can be toggled safely, else more-info. */
  icon_tap_action?: ActionConfig;

  /**
   * The entity whose options become buttons when `actions` is not set, and the default target of every
   * button with an `option`. Default: the main entity if it has options, else the one select on its device.
   */
  action_entity?: string;
  /** Buttons under the tile. Omitted: one per option of `action_entity`. An empty list hides the row. */
  actions?: TileActionConfig[];
  /** Buttons per row (default 4). Rows that are not full stretch to the full width. */
  columns?: number;
  /** More rows of buttons under the first, each from its own entity: the mode, then the fan level. */
  button_rows?: TileButtonRowConfig[];
  /** Show the names on the buttons (default true). */
  show_names?: boolean;
  /** Hide the buttons while the main entity is off or unavailable (default false). */
  hide_actions_when_off?: boolean;
}
