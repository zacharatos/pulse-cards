import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import type { ActionConfig, HassEntity, HomeAssistant, TilePulseCardConfig } from "./types";
import {
  balanceRows,
  clampColumns,
  contentParts,
  cssColor,
  defaultIconTap,
  discoverActionEntity,
  isActive,
  isOff,
  isUnavailable,
  optionsOf,
  resolveRows,
  stateColor,
  stateContentList,
  watchedEntities,
  withPending,
  type ActionRow,
  type ResolvedAction,
} from "./tile";
import { actionHandler, type ActionKind } from "./action-handler";
import { localize, relativeTime } from "./localize";
import { cardStyles } from "./styles";
import "./editor";


/** How long a tapped button waits for its entity to answer before it stops breathing. */
const PENDING_MS = 8000;

/** What the card picker offers first: something that usually has modes or a mode select next to it. */
const STUB_DOMAINS = ["fan", "climate", "humidifier", "media_player", "light", "switch"];

interface Pending {
  entity: string;
  option?: string;
  snapshot?: HassEntity;
  timer: number;
}

type FireConfig = {
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
};

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
  interface HTMLElementTagNameMap {
    "tile-pulse-card": TilePulseCard;
  }
}

export class TilePulseCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TilePulseCardConfig;

  private _actionEntity?: string;
  private _deps: unknown[] = [];
  private _watched = new Set<string>();
  private _ticker?: number;
  /** Buttons tapped and waiting for their entity to change, by button key. */
  private _pending = new Map<string, Pending>();

  // ---- Lovelace API -------------------------------------------------------

  static getConfigElement() {
    return document.createElement("tile-pulse-card-editor");
  }

  static getStubConfig(hass?: HomeAssistant): Partial<TilePulseCardConfig> {
    const ids = Object.keys(hass?.states ?? {});
    for (const d of STUB_DOMAINS) {
      const id = ids.find((e) => e.startsWith(`${d}.`) && !hass?.entities?.[e]?.hidden);
      if (id) return { entity: id };
    }
    return { entity: ids[0] ?? "" };
  }

  setConfig(config: TilePulseCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    if (!config.entity || typeof config.entity !== "string") throw new Error("`entity` is required");
    if (config.actions !== undefined && !Array.isArray(config.actions)) throw new Error("`actions` must be a list");
    for (const a of config.actions ?? []) {
      if (!a || typeof a !== "object") throw new Error("Every item in `actions` must be an object");
    }
    if (config.button_rows !== undefined && !Array.isArray(config.button_rows)) throw new Error("`button_rows` must be a list");
    for (const r of config.button_rows ?? []) {
      if (!r || typeof r !== "object") throw new Error("Every item in `button_rows` must be an object");
      if (r.actions !== undefined && !Array.isArray(r.actions)) throw new Error("`actions` in `button_rows` must be a list");
    }
    if (config.state_content !== undefined && typeof config.state_content !== "string" && !Array.isArray(config.state_content)) {
      throw new Error("`state_content` must be a text or a list");
    }
    this._config = { ...config };
    this._deps = [];
    this._clearPending();
  }

  getCardSize(): number {
    const n = this._config?.actions?.length ?? 3;
    const extra = (this._config?.button_rows ?? []).reduce((sum, r) => sum + Math.max(1, Math.ceil((r?.actions?.length ?? 3) / 6)), 0);
    return 2 + (n ? balanceRows(n, clampColumns(this._config?.columns)).length : 0) + extra;
  }

  getGridOptions() {
    return { columns: 6, min_columns: 3, rows: "auto" as const };
  }

  // ---- Lifecycle ----------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    // "3 minutes ago" changes with time, not with states.
    this._ticker = window.setInterval(() => {
      if (stateContentList(this._config ?? ({} as TilePulseCardConfig)).some((c) => c.startsWith("last"))) this.requestUpdate();
    }, 60_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._ticker) window.clearInterval(this._ticker);
    this._clearPending();
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    const hass = this.hass;
    if (!old || !hass) return true;
    if (old.entities !== hass.entities || old.locale !== hass.locale || old.language !== hass.language || old.themes !== hass.themes) {
      return true;
    }
    for (const id of this._watched) if (old.states[id] !== hass.states[id]) return true;
    return false;
  }

  protected willUpdate(): void {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return;
    // Discovery scans the registry: only when the registry, the config or the main entity's options change.
    const deps = [hass.entities, config, optionsOf(hass.states[config.entity]).length];
    if (deps.some((d, i) => d !== this._deps[i])) {
      this._deps = deps;
      this._actionEntity = discoverActionEntity(hass, config);
      this._watched = watchedEntities(config, this._actionEntity);
    }
    // A tapped button stops waiting as soon as its entity changes.
    for (const [key, p] of this._pending) {
      if (hass.states[p.entity] !== p.snapshot) {
        window.clearTimeout(p.timer);
        this._pending.delete(key);
      }
    }
  }


  private _t = (key: string, vars?: Record<string, string | number>) => localize(this.hass, key, vars);

  // ---- Render -------------------------------------------------------------

  protected render() {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return nothing;
    const s = hass.states[config.entity];
    if (!s) {
      return html`<ha-card
        ><div class="warning"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this._t("missing_entity", { entity: config.entity })}</div></ha-card
      >`;
    }
    const showActions = !(config.hide_actions_when_off && isOff(s));
    const rows = showActions ? this._rows() : [];
    return html`<ha-card>${this._renderTile(s)}${rows.length ? this._renderActions(rows) : nothing}</ha-card>`;
  }

  private _renderTile(s: HassEntity) {
    const hass = this.hass!;
    const config = this._config!;
    const on = isActive(s);
    const name = config.name ?? String(s.attributes.friendly_name ?? s.entity_id);
    const secondary = contentParts(hass, s, stateContentList(config))
      .map((p) => (p.kind === "time" ? relativeTime(hass, p.value) : p.value))
      .filter(Boolean)
      .join(" · ");
    const vertical = config.vertical !== false;
    const iconTap = config.icon_tap_action ?? defaultIconTap(config.entity);
    return html`
      <div
        class=${classMap({ tile: true, vertical, on, unavailable: isUnavailable(s) })}
        style=${styleMap({ "--c": on ? stateColor(s, config.color) : "var(--secondary-text-color)" })}
        role="button"
        tabindex="0"
        aria-label=${secondary ? `${name}, ${secondary}` : name}
        ${actionHandler({ hasHold: true, hasDoubleTap: !!config.double_tap_action })}
        @tpc-action=${(ev: CustomEvent<{ action: ActionKind }>) =>
          this._fire(
            {
              entity: config.entity,
              tap_action: config.tap_action ?? { action: "more-info" },
              hold_action: config.hold_action ?? { action: "more-info" },
              double_tap_action: config.double_tap_action,
            },
            ev.detail.action
          )}
      >
        <button
          class="icon"
          aria-label=${name}
          ${actionHandler({})}
          @pointerdown=${stop}
          @pointerup=${stop}
          @keydown=${stop}
          @click=${stop}
          @tpc-action=${() => this._fire({ entity: config.entity, tap_action: iconTap }, "tap")}
        >
          ${config.icon
            ? html`<ha-icon .icon=${config.icon}></ha-icon>`
            : html`<ha-state-icon .hass=${hass} .stateObj=${s}></ha-state-icon>`}
        </button>
        <div class="text">
          <span class="name">${name}</span>
          ${secondary ? html`<span class="secondary">${secondary}</span>` : nothing}
        </div>
      </div>
    `;
  }

  private _rows(): ActionRow[] {
    const optimistic = new Map<string, string>();
    for (const p of this._pending.values()) if (p.option !== undefined) optimistic.set(p.entity, p.option);
    return resolveRows(this.hass!, this._config!, this._actionEntity).map((r) => ({ ...r, actions: withPending(r.actions, optimistic) }));
  }

  private _renderActions(rows: ActionRow[]) {
    const showNames = this._config!.show_names !== false;
    return html`
      <div class="actions">
        ${rows.map(({ actions, columns }) => {
          let start = 0;
          return balanceRows(actions.length, columns).map((size) => {
            const line = actions.slice(start, (start += size));
            return html`<div class="row">${line.map((a) => this._renderAction(a, showNames))}</div>`;
          });
        })}
      </div>
    `;
  }

  private _renderAction(a: ResolvedAction, showNames: boolean) {
    const hass = this.hass!;
    const s = a.entity ? hass.states[a.entity] : undefined;
    const named = showNames && !!a.name;
    return html`
      <button
        class=${classMap({ act: true, active: a.active, disabled: a.disabled, pending: this._pending.has(a.key), "icon-only": !named })}
        style=${styleMap(a.color ? { "--c": cssColor(a.color) } : {})}
        title=${a.name}
        aria-label=${a.name}
        aria-pressed=${a.active ? "true" : "false"}
        aria-disabled=${a.disabled ? "true" : "false"}
        ${actionHandler({ hasHold: !!a.hold_action, hasDoubleTap: !!a.double_tap_action, disabled: a.disabled })}
        @tpc-action=${(ev: CustomEvent<{ action: ActionKind }>) => this._actionTapped(a, ev.detail.action)}
      >
        <span class="act-in">
          ${a.icon || !s
            ? html`<ha-icon .icon=${a.icon || "mdi:gesture-tap-button"}></ha-icon>`
            : html`<ha-state-icon .hass=${hass} .stateObj=${s}></ha-state-icon>`}
          ${named ? html`<span class="act-name">${a.name}</span>` : nothing}
        </span>
      </button>
    `;
  }

  // ---- Actions ------------------------------------------------------------

  private _actionTapped(a: ResolvedAction, action: ActionKind) {
    if (a.disabled) return;
    const fired = this._fire(
      { entity: a.entity, tap_action: a.tap_action, hold_action: a.hold_action, double_tap_action: a.double_tap_action },
      action
    );
    // A tap that changes its entity (an option, a toggle) waits for the answer; scenes and plain actions don't.
    const changes = a.tap_action.action === "toggle" || (a.option !== undefined && a.tap_action.action === "perform-action");
    if (fired && action === "tap" && a.entity && changes && !a.active) this._setPending(a);
  }

  private _setPending(a: ResolvedAction) {
    const entity = a.entity!;
    // One pending tap per entity: the latest one wins.
    for (const [key, p] of this._pending) {
      if (p.entity === entity) {
        window.clearTimeout(p.timer);
        this._pending.delete(key);
      }
    }
    const timer = window.setTimeout(() => {
      this._pending.delete(a.key);
      this.requestUpdate();
    }, PENDING_MS);
    this._pending.set(a.key, { entity, option: a.option, snapshot: this.hass?.states[entity], timer });
    this.requestUpdate();
  }

  private _clearPending() {
    for (const p of this._pending.values()) window.clearTimeout(p.timer);
    this._pending.clear();
  }

  /** Hand the action to Home Assistant's own handler (confirmation, navigate, perform-action, etc.). */
  private _fire(config: FireConfig, action: ActionKind): boolean {
    const actionConfig = config[`${action}_action` as const];
    if (!actionConfig || actionConfig.action === "none") return false;
    this.dispatchEvent(new CustomEvent("hass-action", { bubbles: true, composed: true, detail: { config, action } }));
    return true;
  }
}

/** Keeps a press on the icon from also reaching the tile under it. */
function stop(ev: Event) {
  ev.stopPropagation();
}

if (!customElements.get("tile-pulse-card")) {
  customElements.define("tile-pulse-card", TilePulseCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "tile-pulse-card",
    name: "Tile Pulse Card",
    description: "A tile for one entity with a row of buttons under it: its modes, a select on the same device, scenes or any action, with the current one lit.",
    preview: true,
  });
}
