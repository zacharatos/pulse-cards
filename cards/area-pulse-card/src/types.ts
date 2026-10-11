// Minimal Home Assistant frontend types used by the card.
// Kept local so the card has no dependency on custom-card-helpers.

export interface HassEntityAttributes {
  friendly_name?: string;
  device_class?: string;
  unit_of_measurement?: string;
  icon?: string;
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
  /** Label IDs. */
  labels?: string[];
}

export interface DeviceRegistryEntry {
  id: string;
  area_id?: string | null;
  name?: string | null;
  name_by_user?: string | null;
  /** Label IDs. */
  labels?: string[];
}

export interface LabelRegistryEntry {
  label_id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
}

export interface AreaRegistryEntry {
  area_id: string;
  name: string;
  icon?: string | null;
  picture?: string | null;
  floor_id?: string | null;
  temperature_entity_id?: string | null;
  humidity_entity_id?: string | null;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  areas: Record<string, AreaRegistryEntry>;
  language: string;
  locale?: { language: string };
  themes?: { darkMode?: boolean };
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<unknown>;
  formatEntityState?: (stateObj: HassEntity, state?: string) => string;
  formatEntityAttributeValue?: (stateObj: HassEntity, attribute: string, value?: unknown) => string;
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

export type PresetId =
  | "lights_toggle"
  | "lights_on"
  | "lights_off"
  | "covers_open"
  | "covers_close"
  | "fans_off"
  | "media_stop"
  | "vacuum_area"
  | "everything_off";

export interface QuickActionConfig {
  /** Optional built-in behaviour. When set, `tap_action` is generated unless you override it. */
  preset?: PresetId;
  name?: string;
  icon?: string;
  /** Entity used for state colour, default toggling, and as target for vacuum_area. */
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  color?: string;
}

export type GroupId =
  | "presence"
  | "motion"
  | "doors"
  | "windows"
  | "covers"
  | "locks"
  | "lights"
  | "fans"
  | "switches"
  | "media"
  | "climate"
  | "alerts"
  | "batteries";

export interface AreaPulseCardConfig {
  type: string;
  area: string;
  name?: string;
  icon?: string;
  color?: string;
  layout?: "default" | "compact";
  show_picture?: boolean;
  show_inactive?: boolean;
  /** Tapping the card header opens the room popup (default true). A `tap_action` takes over when set. */
  room_popup?: boolean;
  temperature_entity?: string;
  humidity_entity?: string;
  sensor_classes?: string[];
  alert_classes?: string[];
  /** All status chips to show, in order. */
  groups?: GroupId[];
  /** Chips placed in the first row (default: motion, doors, windows). The rest go in the second row. Only used with `max_chips: 0`. */
  top_groups?: GroupId[];
  /**
   * How chips are coloured. `state` (default): colour only for what needs a look (open), problems
   * (alerts, low battery, unlocked) and lights, with neutral text and a coloured icon. `category`:
   * one colour per kind of device, tinted text and background (the original look).
   */
  chip_colors?: "state" | "category";
  /** Chips on the card face before the rest collapse into a "+N" chip that opens the room popup (default 3, 0 = all). */
  max_chips?: number;
  /** Light toggled by the area icon and used for the glow colour. Auto-detected when omitted. */
  main_light?: string;
  /** Set to false to keep the area icon passive. */
  link_main_light?: boolean;
  colors?: {
    temperature_low?: string;
    temperature_high?: string;
    humidity_low?: string;
    humidity_high?: string;
  };
  /** Only show entities that carry (or lack) certain Home Assistant labels. See labels.ts. */
  label_filter?: {
    include?: string | string[];
    exclude?: string | string[];
    match?: "any" | "all";
    from_device?: boolean;
  };
  presence_entities?: string[];
  exclude_entities?: string[];
  comfort_temperature?: [number, number] | { min?: number; max?: number };
  comfort_humidity?: [number, number] | { min?: number; max?: number };
  battery_threshold?: number;
  actions?: QuickActionConfig[];
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
