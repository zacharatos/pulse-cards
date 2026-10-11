// Minimal Home Assistant frontend types used by the card.
// Kept local so the card has no dependency on custom-card-helpers (same as Area Pulse Card).

export interface HassEntityAttributes {
  friendly_name?: string;
  device_class?: string;
  unit_of_measurement?: string;
  icon?: string;
  entity_picture?: string;
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

export interface DeviceRegistryEntry {
  id: string;
  area_id?: string | null;
  name?: string | null;
  name_by_user?: string | null;
}

export interface AreaRegistryEntry {
  area_id: string;
  name: string;
  icon?: string | null;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  areas: Record<string, AreaRegistryEntry>;
  user?: { id?: string; name?: string };
  language: string;
  locale?: { language: string; time_zone?: string; time_format?: string };
  config?: { time_zone?: string };
  themes?: { darkMode?: boolean };
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<unknown>;
  formatEntityState?: (stateObj: HassEntity, state?: string) => string;
  formatEntityAttributeValue?: (stateObj: HassEntity, attribute: string, value?: unknown) => string;
  /** The websocket, for subscriptions (the weather forecast). */
  connection?: {
    subscribeMessage: <T>(callback: (msg: T) => void, msg: Record<string, unknown>) => Promise<() => void>;
  };
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

/** The blocks of the card, in the order they are drawn. */
export type SectionId = "greeting" | "status" | "alerts" | "nudges" | "modes" | "alarm" | "pulse" | "shortcuts";

/** Whole-home groups. Same ids and rules as the Area Pulse Card chips, so both cards agree. */
export type PulseId =
  | "alerts"
  | "lights"
  | "doors"
  | "windows"
  | "covers"
  | "locks"
  | "fans"
  | "switches"
  | "media"
  | "climate"
  | "batteries";

export type AlarmMode = "arm_home" | "arm_away" | "arm_night" | "arm_vacation" | "arm_custom_bypass";

export interface ChipConfig {
  entity: string;
  name?: string;
  icon?: string;
  color?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
}

/** One house mode button. */
export interface ModeConfig {
  name?: string;
  icon?: string;
  /** Colour of the button while this mode is active. Default: the theme's primary colour. */
  color?: string;
  /** Option of `mode_entity` this button selects. Defaults to `name` when `mode_entity` is set. */
  option?: string;
  /** A scene, script, input_boolean or switch this button runs or toggles (instead of an option). */
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
}

export type TodayEntity = string | { entity: string; name?: string };

export interface TodayConfig {
  /** Calendars to read (their next event). Default: every visible calendar. */
  calendars?: string[];
  /** Date, timestamp, "days until" or text sensors, e.g. waste collection. */
  entities?: TodayEntity[];
  /** Also show tomorrow (default true). */
  tomorrow?: boolean;
  /** Tap on the line. Default: the first item's more-info. */
  tap_action?: ActionConfig;
}

export interface ShortcutConfig {
  name?: string;
  icon?: string;
  /** Icon colour: HA colour name (`amber`, `blue`, ...) or any CSS colour. Default: the theme's text colour. */
  color?: string;
  /**
   * Shorthand for `tap_action: { action: navigate }`. A path without a leading slash is a view of the
   * current dashboard (`lights` → `/<this-dashboard>/lights`).
   */
  navigation_path?: string;
  /** Entity whose on/off state tints the tile. */
  entity?: string;
  /** Live badge: a pulse group id (`lights` → number of lights on) or an entity id (shows its state). */
  badge?: PulseId | string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface HomePulseCardConfig {
  type: string;
  layout?: "default" | "compact";
  /** `card` (default) draws a normal card; `flat` drops the background so the blocks float on the view. */
  appearance?: "card" | "flat";
  /** Blocks to show, in order. Default: greeting, status, alerts, nudges, shortcuts. */
  sections?: SectionId[];

  /** Greeting text. `{name}` is replaced with the user's first name. Default: time-of-day greeting. */
  title?: string;
  /** Show today's date under the greeting (default true). */
  show_date?: boolean;
  /** Centre the greeting (default false). */
  center_greeting?: boolean;

  /**
   * The "Today" line under the date: today's (and tomorrow's) calendar events and dated sensors.
   * `true`/omitted: every visible calendar. `false` hides it.
   */
  today?: boolean | TodayConfig;

  /** House modes. With an input_select/select, one button per option unless `modes` lists them. */
  mode_entity?: string;
  modes?: ModeConfig[];

  /** People shown as chips. Default: every `person` entity. */
  persons?: string[];
  /** Show people who are away (default true). */
  show_away?: boolean;
  /** Weather entity. Default: the first `weather` entity. `none` hides it. */
  weather_entity?: string;
  /** Extra chips after people and weather. */
  chips?: ChipConfig[];

  /** Alarm panel. Default: the first `alarm_control_panel` entity. `none` hides it. */
  alarm_entity?: string;
  /** Arm buttons offered while disarmed (default arm_home, arm_away), filtered by what the panel supports. */
  alarm_modes?: AlarmMode[];

  /** Whole-home groups to show, in order. */
  pulse?: PulseId[];
  /** Show groups with nothing active, greyed out (default false: only what needs attention). */
  show_inactive?: boolean;
  alert_classes?: string[];
  battery_threshold?: number;
  exclude_entities?: string[];
  /** "Everyone left and 3 lights are on" style hints with a one-tap fix (default true). */
  nudges?: boolean;

  shortcuts?: ShortcutConfig[];
  /** Tiles per row (default 4). Rows that are not full stretch to the full width. */
  columns?: number;
  /** Show names under the shortcut icons (default true). */
  show_names?: boolean;
}
