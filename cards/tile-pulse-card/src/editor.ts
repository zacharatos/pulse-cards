import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import type { HomeAssistant, TileActionConfig, TileButtonRowConfig, TilePulseCardConfig } from "./types";
import { DEFAULT_COLUMNS, DEFAULT_STATE_CONTENT, discoverActionEntity, guessOptionIcon, optionLabel, optionsOf, stateContentList } from "./tile";
import { localize } from "./localize";

type Schema = Record<string, unknown>;

/** Values the editor treats as "not set": they are left out of the YAML. */
const DEFAULTS: Record<string, unknown> = {
  vertical: true,
  columns: DEFAULT_COLUMNS,
  show_names: true,
  hide_actions_when_off: false,
};

/** Domains whose options can become buttons (same list as `tile.ts`). */
const OPTION_DOMAINS = ["select", "input_select", "fan", "climate", "humidifier", "water_heater", "media_player", "number", "input_number"];
/** The first row of buttons is row -1 (the card's own `actions`); `button_rows[r]` are rows 0, 1, ... */
const MAIN = -1;
const TIME_CONTENT = ["state", "last_changed", "last_updated"];
const isEntityId = (v: string) => /^[a-z_]+\.[a-z0-9_]+$/.test(v);

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

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export class TilePulseCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TilePulseCardConfig;
  /** Open list items: "row:2" for a further row, "-1:0" / "2:1" for a button in a row. */
  @state() private _open = new Set<string>();
  @state() private _ready = false;

  connectedCallback(): void {
    super.connectedCallback();
    loadHaElements().then(() => (this._ready = true));
  }

  setConfig(config: TilePulseCardConfig): void {
    this._config = config;
  }

  private _t = (key: string, vars?: Record<string, string | number>) => localize(this.hass, key, vars);

  /** The entity the buttons take their options from: configured, else discovered. */
  private _actionEntity(): string | undefined {
    if (!this.hass || !this._config?.entity) return undefined;
    return discoverActionEntity(this.hass, this._config);
  }

  // ---- Schemas ------------------------------------------------------------

  private _mainSchema(): Schema[] {
    const t = this._t;
    const s = this._config?.entity ? this.hass?.states[this._config.entity] : undefined;
    const attributes = s ? Object.keys(s.attributes).filter((a) => !["friendly_name", "icon", "entity_picture", "supported_features"].includes(a)) : [];
    const contentOptions = [
      ...TIME_CONTENT.map((c) => ({ value: c, label: t(`ed_content_${c}`) })),
      ...attributes.map((a) => ({ value: a, label: (s && this.hass?.formatEntityAttributeName?.(s, a)) || a })),
    ];
    return [
      { name: "entity", required: true, selector: { entity: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        ],
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_tile"),
        icon: "mdi:card-outline",
        flatten: true,
        schema: [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "vertical", selector: { boolean: {} } },
              { name: "color", selector: { ui_color: {} } },
            ],
          },
          { name: "state_content", selector: { select: { multiple: true, reorder: true, mode: "list", options: contentOptions } } },
          { name: "info_entities", selector: { entity: { multiple: true } } },
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
          { name: "icon_tap_action", selector: { ui_action: {} } },
          { name: "hold_action", selector: { ui_action: {} } },
          { name: "double_tap_action", selector: { ui_action: {} } },
        ],
      },
      {
        type: "expandable",
        name: "",
        title: t("ed_section_actions"),
        icon: "mdi:gesture-tap-button",
        flatten: true,
        schema: [
          { name: "action_entity", selector: { entity: { filter: OPTION_DOMAINS.map((domain) => ({ domain })) } } },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "columns", selector: { number: { min: 1, max: 6, mode: "slider" } } },
              { name: "show_names", selector: { boolean: {} } },
            ],
          },
          { name: "hide_actions_when_off", selector: { boolean: {} } },
        ],
      },
    ];
  }

  private _rowSchema(): Schema[] {
    return [
      { name: "action_entity", selector: { entity: { filter: OPTION_DOMAINS.map((domain) => ({ domain })) } } },
      { name: "columns", selector: { number: { min: 1, max: 6, mode: "slider" } } },
    ];
  }

  private _buttonRows(): TileButtonRowConfig[] {
    return [...(this._config?.button_rows ?? [])];
  }

  /** The entity a row's buttons set their option on by default. */
  private _rowTarget(r: number): string | undefined {
    const own = r === MAIN ? undefined : this._config?.button_rows?.[r]?.action_entity;
    return own || this._actionEntity() || this._config?.entity;
  }

  private _actionSchema(item: TileActionConfig, r: number): Schema[] {
    const target = item.entity ?? this._rowTarget(r);
    const s = target ? this.hass?.states[target] : undefined;
    // Option values as they are, labelled the way HA shows them (a combo box shows the value it holds).
    const options = optionsOf(s).map((o) => ({ value: o, label: o }));
    return [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ],
      },
      { name: "entity", selector: { entity: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "option", selector: { select: { mode: "dropdown", custom_value: true, options } } },
          { name: "color", selector: { ui_color: {} } },
        ],
      },
      { name: "tap_action", selector: { ui_action: {} } },
      { name: "hold_action", selector: { ui_action: {} } },
      { name: "double_tap_action", selector: { ui_action: {} } },
    ];
  }

  private _label = (s: { name: string }) => {
    const key = `ed_${s.name}`;
    const v = this._t(key);
    return v === key ? s.name : v;
  };

  // ---- Data mapping -------------------------------------------------------

  private _formData(): Record<string, unknown> {
    const c = this._config!;
    const content = c.state_content === undefined ? DEFAULT_STATE_CONTENT : stateContentList(c);
    return {
      ...DEFAULTS,
      ...c,
      state_content: content.filter((x) => !isEntityId(x)),
      info_entities: content.filter(isEntityId),
    };
  }

  private _mainChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const v = { ...ev.detail.value } as Record<string, unknown>;
    const content = [...((v.state_content as string[] | undefined) ?? []), ...((v.info_entities as string[] | undefined) ?? [])];
    delete v.info_entities;
    v.state_content = same(content, DEFAULT_STATE_CONTENT) ? undefined : content;
    for (const [k, d] of Object.entries(DEFAULTS)) if (same(v[k], d)) delete v[k];
    const next = clean({ ...v, actions: undefined, button_rows: undefined }) as unknown as TilePulseCardConfig;
    // An empty line under the name and an empty button list are both deliberate: keep them.
    if (Array.isArray(v.state_content) && !v.state_content.length) next.state_content = [];
    if (this._config?.actions) next.actions = this._config.actions;
    if (this._config?.button_rows?.length) next.button_rows = this._config.button_rows;
    this._commit(next);
  }

  // ---- Buttons ------------------------------------------------------------

  /** The buttons a row draws today on its own, written out so they can be edited. */
  private _autoActions(r: number): TileActionConfig[] {
    const target = r === MAIN ? this._actionEntity() : this._config?.button_rows?.[r]?.action_entity;
    if (!target || !this.hass) return [];
    return optionsOf(this.hass.states[target]).map((option) => ({ option, icon: guessOptionIcon(option) }));
  }

  private _rowActions(r: number): TileActionConfig[] | undefined {
    return r === MAIN ? this._config?.actions : this._config?.button_rows?.[r]?.actions;
  }

  private _items(r: number): TileActionConfig[] {
    return [...(this._rowActions(r) ?? [])];
  }

  private _setItems(r: number, items: TileActionConfig[]) {
    if (r === MAIN) {
      this._commit({ ...this._config!, actions: items });
      return;
    }
    const rows = this._buttonRows();
    rows[r] = { ...rows[r], actions: items };
    this._commit({ ...this._config!, button_rows: rows });
  }

  private _itemChanged(r: number, i: number, ev: CustomEvent) {
    ev.stopPropagation();
    const items = this._items(r);
    items[i] = clean({ ...ev.detail.value }) as TileActionConfig;
    this._setItems(r, items);
  }

  private _customize(r: number) {
    this._open = new Set();
    this._setItems(r, this._autoActions(r));
  }

  private _addItem(r: number) {
    const items = this._rowActions(r) ? this._items(r) : this._autoActions(r);
    items.push({});
    this._open = new Set([...this._open, `${r}:${items.length - 1}`]);
    this._setItems(r, items);
  }

  private _removeItem(r: number, i: number) {
    const items = this._items(r);
    items.splice(i, 1);
    this._open = new Set([...this._open].filter((k) => k.startsWith("row:")));
    this._setItems(r, items);
  }

  private _moveItem(r: number, i: number, dir: -1 | 1) {
    const items = this._items(r);
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    this._open = new Set([...this._open].filter((k) => k.startsWith("row:")));
    this._setItems(r, items);
  }

  private _toggleOpen(key: string) {
    const open = new Set(this._open);
    open.has(key) ? open.delete(key) : open.add(key);
    this._open = open;
  }

  // ---- Further rows -------------------------------------------------------

  private _addRow() {
    const rows = this._buttonRows();
    rows.push({});
    this._open = new Set([...this._open, `row:${rows.length - 1}`]);
    this._commit({ ...this._config!, button_rows: rows });
  }

  private _removeRow(r: number) {
    const rows = this._buttonRows();
    rows.splice(r, 1);
    this._open = new Set();
    this._commit(clean({ ...this._config!, button_rows: rows }) as TilePulseCardConfig);
  }

  private _moveRow(r: number, dir: -1 | 1) {
    const rows = this._buttonRows();
    const j = r + dir;
    if (j < 0 || j >= rows.length) return;
    [rows[r], rows[j]] = [rows[j], rows[r]];
    this._open = new Set();
    this._commit({ ...this._config!, button_rows: rows });
  }

  private _rowChanged(r: number, ev: CustomEvent) {
    ev.stopPropagation();
    const rows = this._buttonRows();
    const v = { ...ev.detail.value } as Record<string, unknown>;
    if (same(v.columns, this._config?.columns ?? DEFAULT_COLUMNS)) delete v.columns;
    // A new options entity means new buttons: drop the ones written out for the old one.
    const actions = v.action_entity !== rows[r]?.action_entity ? undefined : rows[r]?.actions;
    rows[r] = clean({ ...v, actions }) as TileButtonRowConfig;
    this._commit({ ...this._config!, button_rows: rows });
  }

  private _commit(config: TilePulseCardConfig) {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  // ---- Render -------------------------------------------------------------

  protected render() {
    if (!this.hass || !this._config || !this._ready) return nothing;
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
        ${this._renderActionList(MAIN)}
      </div>
      ${this._renderRows()}
    `;
  }

  private _entityName(id: string | undefined): string {
    return id ? String(this.hass!.states[id]?.attributes.friendly_name ?? id) : "";
  }

  /** A row's buttons: the hint, "customise" while they are automatic, the list and "add". */
  private _renderActionList(r: number) {
    const actions = this._rowActions(r);
    const auto = r === MAIN ? this._actionEntity() : this._config!.button_rows?.[r]?.action_entity;
    const autoCount = actions ? 0 : this._autoActions(r).length;
    return html`
      ${actions
        ? html`<p class="hint">${this._t("ed_actions_hint")}</p>`
        : autoCount
        ? html`<p class="hint">${this._t("ed_auto_hint", { entity: this._entityName(auto) })}</p>
            <button class="add" @click=${() => this._customize(r)}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${this._t("ed_customize")}
            </button>`
        : html`<p class="hint">${this._t(r === MAIN ? "ed_auto_none" : "ed_row_none")}</p>`}
      ${(actions ?? []).map((a, i) => this._renderItem(a, r, i, actions!.length))}
      <button class="add" @click=${() => this._addItem(r)}>
        <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_action")}
      </button>
    `;
  }

  /** The further rows: each one an item with its options entity, its width and its own button list. */
  private _renderRows() {
    const rows = this._config!.button_rows ?? [];
    return html`
      <div class="section">
        <div class="section-title"><ha-icon icon="mdi:table-row-plus-after"></ha-icon>${this._t("ed_section_rows")}</div>
        <p class="hint">${this._t("ed_rows_hint")}</p>
        ${rows.map((row, r) => {
          const key = `row:${r}`;
          const open = this._open.has(key);
          const title = row.action_entity ? this._entityName(row.action_entity) : this._t("ed_row_n", { n: r + 2 });
          return html`
            <div class="item">
              ${this._itemHead(key, open, title, undefined, r, rows.length, (dir) => this._moveRow(r, dir), () => this._removeRow(r))}
              ${open
                ? html`<div class="item-body rows">
                    <ha-form
                      .hass=${this.hass}
                      .data=${{ columns: this._config!.columns ?? DEFAULT_COLUMNS, ...row }}
                      .schema=${this._rowSchema()}
                      .computeLabel=${this._label}
                      @value-changed=${(e: CustomEvent) => this._rowChanged(r, e)}
                    ></ha-form>
                    ${this._renderActionList(r)}
                  </div>`
                : nothing}
            </div>
          `;
        })}
        <button class="add" @click=${this._addRow}>
          <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_row")}
        </button>
      </div>
    `;
  }

  private _itemTitle(a: TileActionConfig, r: number, i: number): string {
    if (a.name) return a.name;
    if (a.option !== undefined) {
      const target = a.entity ?? this._rowTarget(r) ?? this._config!.entity;
      return optionLabel(this.hass, this.hass!.states[target], String(a.option));
    }
    if (a.entity) return this._entityName(a.entity);
    return this._t("ed_action_n", { n: i + 1 });
  }

  private _itemHead(
    key: string,
    open: boolean,
    title: string,
    icon: string | undefined,
    i: number,
    total: number,
    move: (dir: -1 | 1) => void,
    remove: () => void
  ) {
    return html`
      <div class="item-head">
        <button class="head-main" @click=${() => this._toggleOpen(key)} aria-expanded=${String(open)}>
          <ha-icon .icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          ${icon ? html`<ha-icon class="sc-icon" .icon=${icon}></ha-icon>` : nothing}
          <span>${title}</span>
        </button>
        <button class="icon-btn" title=${this._t("ed_move_up")} ?disabled=${i === 0} @click=${() => move(-1)}>
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button class="icon-btn" title=${this._t("ed_move_down")} ?disabled=${i === total - 1} @click=${() => move(1)}>
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button class="icon-btn danger" title=${this._t("ed_remove")} @click=${remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
    `;
  }

  private _renderItem(item: TileActionConfig, r: number, i: number, total: number) {
    const key = `${r}:${i}`;
    const open = this._open.has(key);
    return html`
      <div class="item">
        ${this._itemHead(key, open, this._itemTitle(item, r, i), item.icon, i, total, (dir) => this._moveItem(r, i, dir), () => this._removeItem(r, i))}
        ${open
          ? html`
              <div class="item-body">
                <ha-form
                  .hass=${this.hass}
                  .data=${item}
                  .schema=${this._actionSchema(item, r)}
                  .computeLabel=${this._label}
                  @value-changed=${(e: CustomEvent) => this._itemChanged(r, i, e)}
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
    .item { border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden; }
    .item-head { display: flex; align-items: center; gap: 2px; padding: 4px; }
    button {
      font: inherit; color: var(--primary-text-color); background: none; border: none; cursor: pointer;
      border-radius: 8px; --mdc-icon-size: 20px;
    }
    button:hover:not([disabled]) { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    button[disabled] { opacity: 0.35; cursor: default; }
    .head-main { flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px; text-align: left; min-width: 0; }
    .head-main span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sc-icon { color: var(--secondary-text-color); }
    .icon-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
    .icon-btn.danger ha-icon { color: var(--error-color, #db4437); }
    .item-body { padding: 4px 12px 12px; border-top: 1px solid var(--divider-color); }
    .item-body.rows { display: flex; flex-direction: column; gap: 8px; }
    .hint { margin: 0; font-size: 13px; color: var(--secondary-text-color); }
    .add {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 10px; border: 1px dashed var(--divider-color); border-radius: 12px; color: var(--primary-color);
      font-weight: 500;
    }
  `;
}

if (!customElements.get("tile-pulse-card-editor")) {
  customElements.define("tile-pulse-card-editor", TilePulseCardEditor);
}
