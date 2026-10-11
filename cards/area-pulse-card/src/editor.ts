import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import type { AreaPulseCardConfig, HomeAssistant, QuickActionConfig } from "./types";
import { DEFAULT_ALERT_CLASSES, DEFAULT_GROUPS, DEFAULT_MAX_CHIPS, DEFAULT_TOP_GROUPS, SENSOR_CLASS_OPTIONS } from "./discovery";
import { PRESETS } from "./presets";
import { toList } from "./labels";
import { localize } from "./localize";

type Schema = Record<string, unknown>;

const ALERT_CLASS_OPTIONS = [
  ...DEFAULT_ALERT_CLASSES,
  "vibration",
  "cold",
  "heat",
  "sound",
  "light",
];

/** Make sure HA's lazily-loaded form elements exist before rendering the editor. */
async function loadHaElements(): Promise<void> {
  if (customElements.get("ha-form") && customElements.get("ha-selector")) return;
  try {
    const helpers = await (window as unknown as { loadCardHelpers?: () => Promise<any> }).loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: "entities", entities: [] });
    await card?.constructor?.getConfigElement?.();
  } catch {
    /* the card editor dialog usually has them loaded already */
  }
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as T;
}

export class AreaPulseCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: AreaPulseCardConfig;
  @state() private _open = new Set<number>();
  @state() private _ready = false;

  connectedCallback(): void {
    super.connectedCallback();
    loadHaElements().then(() => (this._ready = true));
  }

  setConfig(config: AreaPulseCardConfig): void {
    this._config = config;
  }

  private _t = (key: string, vars?: Record<string, string | number>) => localize(this.hass, key, vars);

  // ---- Schemas ------------------------------------------------------------

  private _mainSchema(): Schema[] {
    const t = this._t;
    return [
      { name: "area", required: true, selector: { area: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ],
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "color", selector: { ui_color: {} } },
          {
            name: "layout",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "default", label: t("ed_layout_default") },
                  { value: "compact", label: t("ed_layout_compact") },
                ],
              },
            },
          },
        ],
      },
      { name: "show_picture", selector: { boolean: {} } },
      { name: "room_popup", selector: { boolean: {} } },
      { name: "link_main_light", selector: { boolean: {} } },
      { name: "main_light", selector: { entity: { filter: { domain: "light" } } } },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_climate"),
        icon: "mdi:thermometer",
        flatten: true,
        schema: [
          {
            name: "temperature_entity",
            selector: { entity: { filter: { domain: "sensor", device_class: "temperature" } } },
          },
          {
            name: "humidity_entity",
            selector: { entity: { filter: { domain: "sensor", device_class: "humidity" } } },
          },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "comfort_temp_min", selector: { number: { mode: "box", step: 0.5 } } },
              { name: "comfort_temp_max", selector: { number: { mode: "box", step: 0.5 } } },
              { name: "comfort_hum_min", selector: { number: { mode: "box", min: 0, max: 100 } } },
              { name: "comfort_hum_max", selector: { number: { mode: "box", min: 0, max: 100 } } },
            ],
          },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "color_temp_low", selector: { ui_color: {} } },
              { name: "color_temp_high", selector: { ui_color: {} } },
              { name: "color_hum_low", selector: { ui_color: {} } },
              { name: "color_hum_high", selector: { ui_color: {} } },
            ],
          },
          {
            name: "sensor_classes",
            selector: {
              select: {
                multiple: true,
                mode: "list",
                options: SENSOR_CLASS_OPTIONS.map((c) => ({ value: c, label: c.replace(/_/g, " ") })),
              },
            },
          },
        ],
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_status"),
        icon: "mdi:list-status",
        flatten: true,
        schema: [
          { name: "show_inactive", selector: { boolean: {} } },
          {
            name: "chip_colors",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "state", label: t("ed_chip_colors_state") },
                  { value: "category", label: t("ed_chip_colors_category") },
                ],
              },
            },
          },
          { name: "max_chips", selector: { number: { min: 0, max: 12, mode: "box" } } },
          {
            name: "groups",
            selector: {
              select: {
                multiple: true,
                reorder: true,
                mode: "list",
                options: DEFAULT_GROUPS.filter((g) => g !== "presence").map((g) => ({
                  value: g,
                  label: t(`g_${g}`),
                })),
              },
            },
          },
          {
            name: "top_groups",
            selector: {
              select: {
                multiple: true,
                reorder: true,
                mode: "list",
                options: DEFAULT_GROUPS.filter((g) => g !== "presence" && g !== "alerts").map((g) => ({
                  value: g,
                  label: t(`g_${g}`),
                })),
              },
            },
          },
          {
            name: "alert_classes",
            selector: {
              select: {
                multiple: true,
                mode: "dropdown",
                options: ALERT_CLASS_OPTIONS.map((c) => ({ value: c, label: c.replace(/_/g, " ") })),
              },
            },
          },
          {
            name: "presence_entities",
            selector: { entity: { multiple: true, filter: [{ domain: "binary_sensor" }, { domain: "person" }, { domain: "input_boolean" }] } },
          },
          { name: "exclude_entities", selector: { entity: { multiple: true } } },
          { name: "battery_threshold", selector: { number: { min: 1, max: 100, mode: "slider", unit_of_measurement: "%" } } },
        ],
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_labels"),
        icon: "mdi:label-multiple-outline",
        flatten: true,
        schema: [
          { name: "label_include", selector: { label: { multiple: true } } },
          { name: "label_exclude", selector: { label: { multiple: true } } },
          {
            name: "label_match",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "any", label: t("ed_label_match_any") },
                  { value: "all", label: t("ed_label_match_all") },
                ],
              },
            },
          },
          { name: "label_from_device", selector: { boolean: {} } },
        ],
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_interactions"),
        icon: "mdi:gesture-tap",
        flatten: true,
        schema: [
          { name: "tap_action", selector: { ui_action: {} } },
          { name: "hold_action", selector: { ui_action: {} } },
          { name: "double_tap_action", selector: { ui_action: {} } },
        ],
      },
    ];
  }

  private _actionSchema(a: QuickActionConfig): Schema[] {
    const t = this._t;
    return [
      {
        name: "preset",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "", label: t("ed_preset_none") },
              ...PRESETS.map((p) => ({ value: p, label: t(`preset_${p}`) })),
            ],
          },
        },
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ],
      },
      {
        name: "entity",
        selector: { entity: a.preset === "vacuum_area" ? { filter: { domain: "vacuum" } } : {} },
      },
      { name: "color", selector: { ui_color: {} } },
      { name: "tap_action", selector: { ui_action: {} } },
      { name: "hold_action", selector: { ui_action: {} } },
    ];
  }

  private _label = (s: { name: string }) => {
    const map: Record<string, string> = {
      area: "ed_area",
      name: "ed_name",
      icon: "ed_icon",
      color: "ed_color",
      layout: "ed_layout",
      show_picture: "ed_show_picture",
      room_popup: "ed_room_popup",
      show_inactive: "ed_show_inactive",
      chip_colors: "ed_chip_colors",
      max_chips: "ed_max_chips",
      temperature_entity: "ed_temperature_entity",
      humidity_entity: "ed_humidity_entity",
      sensor_classes: "ed_sensor_classes",
      comfort_temp_min: "ed_comfort_temp_min",
      comfort_temp_max: "ed_comfort_temp_max",
      comfort_hum_min: "ed_comfort_hum_min",
      comfort_hum_max: "ed_comfort_hum_max",
      groups: "ed_groups",
      top_groups: "ed_top_groups",
      label_include: "ed_label_include",
      label_exclude: "ed_label_exclude",
      label_match: "ed_label_match",
      label_from_device: "ed_label_from_device",
      main_light: "ed_main_light",
      link_main_light: "ed_link_main_light",
      color_temp_low: "ed_color_temp_low",
      color_temp_high: "ed_color_temp_high",
      color_hum_low: "ed_color_hum_low",
      color_hum_high: "ed_color_hum_high",
      alert_classes: "ed_alert_classes",
      presence_entities: "ed_presence_entities",
      exclude_entities: "ed_exclude_entities",
      battery_threshold: "ed_battery_threshold",
      tap_action: "ed_tap_action",
      hold_action: "ed_hold_action",
      double_tap_action: "ed_double_tap_action",
      preset: "ed_preset",
      entity: "ed_entity",
    };
    return map[s.name] ? this._t(map[s.name]) : s.name;
  };

  // ---- Data mapping -------------------------------------------------------

  private _formData(): Record<string, unknown> {
    const c = this._config!;
    const band = (b: AreaPulseCardConfig["comfort_temperature"]) =>
      Array.isArray(b) ? { min: b[0], max: b[1] } : b ?? {};
    const tb = band(c.comfort_temperature);
    const hb = band(c.comfort_humidity);
    return {
      layout: "default",
      show_picture: true,
      room_popup: true,
      show_inactive: false,
      chip_colors: "state",
      max_chips: DEFAULT_MAX_CHIPS,
      battery_threshold: 20,
      link_main_light: true,
      top_groups: DEFAULT_TOP_GROUPS,
      ...c,
      label_include: toList(c.label_filter?.include),
      label_exclude: toList(c.label_filter?.exclude),
      label_match: c.label_filter?.match ?? "any",
      label_from_device: c.label_filter?.from_device ?? true,
      color_temp_low: c.colors?.temperature_low,
      color_temp_high: c.colors?.temperature_high,
      color_hum_low: c.colors?.humidity_low,
      color_hum_high: c.colors?.humidity_high,
      comfort_temp_min: tb.min,
      comfort_temp_max: tb.max,
      comfort_hum_min: hb.min,
      comfort_hum_max: hb.max,
    };
  }

  private _mainChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const v = { ...ev.detail.value } as Record<string, unknown>;
    const pick = (a: unknown, b: unknown) =>
      a === undefined && b === undefined ? undefined : clean({ min: a, max: b } as Record<string, unknown>);
    const comfort_temperature = pick(v.comfort_temp_min, v.comfort_temp_max);
    const comfort_humidity = pick(v.comfort_hum_min, v.comfort_hum_max);
    delete v.comfort_temp_min;
    delete v.comfort_temp_max;
    delete v.comfort_hum_min;
    delete v.comfort_hum_max;
    const colors = clean({
      temperature_low: v.color_temp_low,
      temperature_high: v.color_temp_high,
      humidity_low: v.color_hum_low,
      humidity_high: v.color_hum_high,
    } as Record<string, unknown>);
    for (const k of ["color_temp_low", "color_temp_high", "color_hum_low", "color_hum_high"]) delete v[k];
    const labelFilter = clean({
      include: v.label_include,
      exclude: v.label_exclude,
      match: v.label_match === "all" ? "all" : undefined,
      from_device: v.label_from_device === false ? false : undefined,
    } as Record<string, unknown>);
    for (const k of ["label_include", "label_exclude", "label_match", "label_from_device"]) delete v[k];
    v.label_filter = Object.keys(labelFilter).length ? labelFilter : undefined;
    v.colors = Object.keys(colors).length ? colors : undefined;
    if (JSON.stringify(v.top_groups) === JSON.stringify(DEFAULT_TOP_GROUPS)) delete v.top_groups;
    const next = clean({
      ...v,
      comfort_temperature: comfort_temperature && Object.keys(comfort_temperature).length ? comfort_temperature : undefined,
      comfort_humidity: comfort_humidity && Object.keys(comfort_humidity).length ? comfort_humidity : undefined,
      actions: this._config?.actions,
    }) as unknown as AreaPulseCardConfig;
    // Drop defaults to keep YAML tidy.
    if ((next as any).layout === "default") delete (next as any).layout;
    if ((next as any).show_picture === true) delete (next as any).show_picture;
    if ((next as any).room_popup === true) delete (next as any).room_popup;
    if ((next as any).show_inactive === false) delete (next as any).show_inactive;
    if ((next as any).chip_colors === "state") delete (next as any).chip_colors;
    if ((next as any).max_chips === DEFAULT_MAX_CHIPS) delete (next as any).max_chips;
    if ((next as any).battery_threshold === 20) delete (next as any).battery_threshold;
    if ((next as any).link_main_light === true) delete (next as any).link_main_light;
    this._commit(next);
  }

  private _actionChanged(i: number, ev: CustomEvent) {
    ev.stopPropagation();
    const actions = [...(this._config?.actions ?? [])];
    actions[i] = clean({ ...ev.detail.value }) as QuickActionConfig;
    this._commit({ ...this._config!, actions });
  }

  private _addAction() {
    const actions = [...(this._config?.actions ?? []), { preset: "lights_toggle" } as QuickActionConfig];
    this._open = new Set([...this._open, actions.length - 1]);
    this._commit({ ...this._config!, actions });
  }

  private _removeAction(i: number) {
    const actions = [...(this._config?.actions ?? [])];
    actions.splice(i, 1);
    this._open = new Set();
    this._commit(clean({ ...this._config!, actions }) as AreaPulseCardConfig);
  }

  private _moveAction(i: number, dir: -1 | 1) {
    const actions = [...(this._config?.actions ?? [])];
    const j = i + dir;
    if (j < 0 || j >= actions.length) return;
    [actions[i], actions[j]] = [actions[j], actions[i]];
    this._open = new Set();
    this._commit({ ...this._config!, actions });
  }

  private _toggleOpen(i: number) {
    const open = new Set(this._open);
    open.has(i) ? open.delete(i) : open.add(i);
    this._open = open;
  }

  private _commit(config: AreaPulseCardConfig) {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  // ---- Render -------------------------------------------------------------

  protected render() {
    if (!this.hass || !this._config || !this._ready) return nothing;
    const actions = this._config.actions ?? [];
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._mainSchema()}
        .computeLabel=${this._label}
        @value-changed=${this._mainChanged}
      ></ha-form>

      <div class="section">
        <div class="section-title"><ha-icon icon="mdi:gesture-tap-button"></ha-icon>${this._t("ed_section_actions")}</div>
        ${actions.map((a, i) => this._renderAction(a, i, actions.length))}
        <button class="add" @click=${this._addAction}>
          <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_action")}
        </button>
      </div>
    `;
  }

  private _renderAction(a: QuickActionConfig, i: number, total: number) {
    const open = this._open.has(i);
    const title = a.name || (a.preset ? this._t(`preset_${a.preset}`) : a.entity) || this._t("ed_action_n", { n: i + 1 });
    return html`
      <div class="action-item">
        <div class="action-head">
          <button class="head-main" @click=${() => this._toggleOpen(i)} aria-expanded=${String(open)}>
            <ha-icon .icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
            <span>${title}</span>
          </button>
          <button class="icon-btn" title=${this._t("ed_move_up")} ?disabled=${i === 0} @click=${() => this._moveAction(i, -1)}>
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
          <button class="icon-btn" title=${this._t("ed_move_down")} ?disabled=${i === total - 1} @click=${() => this._moveAction(i, 1)}>
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
          <button class="icon-btn danger" title=${this._t("ed_remove")} @click=${() => this._removeAction(i)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${open
          ? html`
              <div class="action-body">
                ${a.preset === "vacuum_area" ? html`<p class="hint">${this._t("ed_vacuum_hint")}</p>` : nothing}
                <ha-form
                  .hass=${this.hass}
                  .data=${{ preset: "", ...a }}
                  .schema=${this._actionSchema(a)}
                  .computeLabel=${this._label}
                  @value-changed=${(e: CustomEvent) => this._actionChanged(i, e)}
                ></ha-form>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; }
    .section { margin-top: 24px; display: flex; flex-direction: column; gap: 8px; }
    .section-title {
      display: flex; align-items: center; gap: 8px;
      font-weight: 500; font-size: 15px; color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .section-title ha-icon { color: var(--secondary-text-color); }
    .action-item {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
    }
    .action-head { display: flex; align-items: center; gap: 2px; padding: 4px; }
    button {
      font: inherit; color: var(--primary-text-color); background: none; border: none; cursor: pointer;
      border-radius: 8px; --mdc-icon-size: 20px;
    }
    button:hover:not([disabled]) { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    button[disabled] { opacity: 0.35; cursor: default; }
    .head-main {
      flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px; text-align: left; min-width: 0;
    }
    .head-main span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .icon-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
    .icon-btn.danger ha-icon { color: var(--error-color, #db4437); }
    .action-body { padding: 4px 12px 12px; border-top: 1px solid var(--divider-color); }
    .hint { margin: 8px 0; font-size: 13px; color: var(--secondary-text-color); }
    .add {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 10px; border: 1px dashed var(--divider-color); border-radius: 12px; color: var(--primary-color);
      font-weight: 500;
    }
  `;
}

if (!customElements.get("area-pulse-card-editor")) {
  customElements.define("area-pulse-card-editor", AreaPulseCardEditor);
}
