// Minimal Home Assistant frontend types used by the card.
// Kept local so the card has no dependency on custom-card-helpers (same as the other Pulse cards).

export interface HassEntity {
  entity_id: string;
  /** For a scene: the ISO time it was last activated, or "unknown" when it never ran. */
  state: string;
  attributes: Record<string, unknown> & {
    friendly_name?: string;
    icon?: string;
    /** A scene's config id (scenes made in the UI or in scenes.yaml with an id): links to its editor. */
    id?: string;
    /** The entities a scene sets. */
    entity_id?: string[];
    options?: string[];
  };
  last_changed: string;
  last_updated: string;
}

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  name?: string | null;
  area_id?: string | null;
  device_id?: string | null;
  hidden?: boolean;
  labels?: string[];
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  areas?: Record<string, { area_id: string; name: string }>;
  devices?: Record<string, { id: string; area_id?: string | null }>;
  user?: { is_admin?: boolean };
  language: string;
  locale?: { language: string; time_format?: string };
  themes?: { darkMode?: boolean };
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>;
  callApi: <T>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, body?: Record<string, unknown>) => Promise<T>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<unknown>;
  formatEntityState?: (stateObj: HassEntity, state?: string) => string;
}

export type GroupBy = "none" | "area" | "label";

export interface ScenePulseCardConfig {
  type: string;
  /** Header title. Default "Scenes"; an empty text hides it. */
  title?: string;
  /** Scenes shown first, in this order. */
  entities?: string[];
  /** Label ids: every scene carrying one of them is shown too, after `entities`, by name. */
  label?: string | string[];
  /** Never shown, even when they carry the label. */
  exclude?: string[];
  /** Section titles by area or label. Default none. */
  group_by?: GroupBy;
  /** Ask before running these. */
  confirm?: string[];
  /** Seconds lights take to fade into a scene. Default none (the scene's own behaviour). */
  transition?: number;
  /** The house mode selector (input_select / select). Default: the one Home Pulse finds; "none" turns it off. */
  mode_entity?: string;
  /** Offer "Undo" after running a scene. Default true. */
  undo?: boolean;
}

/** A scene's stored config, as `GET /api/config/scene/config/<id>` returns it. */
export interface SceneConfig {
  id?: string;
  name?: string;
  icon?: string;
  entities: Record<string, Record<string, unknown> & { state?: string }>;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface LabelEntry {
  label_id: string;
  name: string;
}

/** Native Home Assistant action config (subset). Passed through untouched to HA's `hass-action`. */
export interface ActionConfig {
  action: "none" | "more-info" | "navigate" | "perform-action";
  navigation_path?: string;
  perform_action?: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  confirmation?: boolean | { text?: string };
}
