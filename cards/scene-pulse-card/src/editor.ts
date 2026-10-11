import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import type { HomeAssistant, ScenePulseCardConfig } from "./types";
import { asList } from "./scenes";
import { localize } from "./localize";
import { loadHaElements } from "./ha";

type Schema = Record<string, unknown>;

const SCENES = { entity: { multiple: true, filter: [{ domain: "scene" }] } };

/** Values left out of the YAML when they equal the default. */
function clean(v: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, x] of Object.entries(v)) {
    if (x === undefined || x === null || x === "") continue;
    if (Array.isArray(x) && !x.length) continue;
    if (k === "group_by" && x === "none") continue;
    if (k === "undo" && x === true) continue;
    if (k === "transition" && x === 0) continue;
    out[k] = x;
  }
  return out;
}

export class ScenePulseCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: ScenePulseCardConfig;
  @state() private _ready = false;

  connectedCallback(): void {
    super.connectedCallback();
    loadHaElements().then(() => (this._ready = true));
  }

  setConfig(config: ScenePulseCardConfig): void {
    this._config = config;
  }

  private _t = (key: string) => localize(this.hass, key);

  private _schema(): Schema[] {
    const t = this._t;
    return [
      { name: "title", selector: { text: {} } },
      { name: "label", selector: { label: { multiple: true } } },
      { name: "entities", selector: SCENES },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_more"),
        icon: "mdi:tune-variant",
        flatten: true,
        schema: [
          {
            name: "group_by",
            selector: {
              select: {
                mode: "dropdown",
                options: ["none", "area", "label"].map((v) => ({ value: v, label: t(`ed_group_${v}`) })),
              },
            },
          },
          { name: "mode_entity", selector: { entity: { filter: [{ domain: "input_select" }, { domain: "select" }] } } },
          { name: "transition", selector: { number: { min: 0, max: 300, step: 0.5, mode: "box", unit_of_measurement: "s" } } },
          { name: "undo", selector: { boolean: {} } },
          { name: "confirm", selector: SCENES },
          { name: "exclude", selector: SCENES },
        ],
      },
    ];
  }

  private _label = (s: { name: string }) => {
    const key = `ed_${s.name}`;
    const v = this._t(key);
    return v === key ? s.name : v;
  };

  private _helper = (s: { name: string }) => (s.name === "mode_entity" ? this._t("ed_mode_hint") : undefined);

  private _changed(ev: CustomEvent) {
    ev.stopPropagation();
    const v = { ...ev.detail.value } as Record<string, unknown>;
    // One label stays a plain text in YAML, several become a list.
    const labels = asList(v.label as string | string[] | undefined);
    v.label = labels.length === 1 ? labels[0] : labels;
    // "none" can't be shown by the entity picker: keep it unless someone picks a selector.
    if (this._config!.mode_entity === "none" && !v.mode_entity) v.mode_entity = "none";
    const config = { ...clean(v), type: this._config!.type } as ScenePulseCardConfig;
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    if (!this._ready) return nothing;
    // "none" (no mode link) is a YAML-only value; the entity picker shows it as empty.
    const mode = this._config.mode_entity === "none" ? undefined : this._config.mode_entity;
    const data = { group_by: "none", undo: true, ...this._config, mode_entity: mode, label: asList(this._config.label) };
    return html`
      <p class="hint">${this._t("ed_hint")}</p>
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._schema()}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._changed}
      ></ha-form>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .hint {
      margin: 0 0 12px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
  `;
}
