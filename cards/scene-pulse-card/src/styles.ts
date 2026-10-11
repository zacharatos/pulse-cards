import { css } from "lit";

// Design: a calm list, the same family as Flow Pulse. One row per scene (icon disc, name, one quiet line,
// a run button, a menu). Surfaces stay neutral; the accent appears only on a scene that is active right now.
// A scene that needs a look is orange. Shapes, chips and motion match the other Pulse cards.
export const cardStyles = css`
  :host {
    /* Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then a plain literal. Without the Pulse theme the card follows HA's theme. */
    --scp-accent: var(--pulse-accent, var(--primary-color));
    --scp-on-accent: var(--pulse-on-accent, var(--text-primary-color, #fff));
    --scp-ok: var(--pulse-ok, var(--green-color, #4caf50));
    --scp-warn: var(--pulse-warn, var(--orange-color, #ff9800));
    --scp-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 6%, transparent));
    --scp-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    --scp-neutral-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --scp-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --scp-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --scp-chip-height: var(--pulse-chip-height, 30px);
    --scp-row-height: var(--pulse-row-height, 56px);
    --scp-gap: var(--pulse-gap, 12px);
    --scp-pad: var(--pulse-pad, 12px);
    --scp-motion-fast: var(--pulse-motion-fast, 120ms);
    --scp-motion-normal: var(--pulse-motion-normal, 200ms);
    --scp-motion-slow: var(--pulse-motion-slow, 250ms);
    --scp-ease: var(--pulse-ease, ease);
    /* Fills inside the menu: a share of the text colour, because the menu sits on HA's dialog surface,
       where a frosted-white fill (Pulse Glass light) would vanish. */
    --scp-menu-fill: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    --scp-menu-fill-hover: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    display: block;
    height: 100%;
  }

  ha-card {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: calc(var(--scp-gap) - 4px);
    padding: var(--scp-pad);
    overflow: hidden;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:focus-visible {
    outline: 2px solid var(--scp-accent);
    outline-offset: 2px;
  }

  /* ---- Header: title, the house mode, "new scene" ---- */
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: var(--scp-chip-height);
    padding: 0 2px;
  }
  .title {
    flex: 1;
    min-width: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chips {
    display: flex;
    gap: 6px;
    flex: none;
    margin-inline-start: auto;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--scp-chip-height);
    padding: 0 12px 0 10px;
    border-radius: calc(var(--scp-chip-height) / 2);
    background: var(--scp-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background-color var(--scp-motion-normal) var(--scp-ease), color var(--scp-motion-normal) var(--scp-ease),
      transform var(--scp-motion-fast) var(--scp-ease);
    --mdc-icon-size: 16px;
  }
  .chip:hover {
    background: var(--scp-neutral-bg-hover);
    color: var(--primary-text-color);
  }
  .chip:active {
    transform: scale(0.96);
  }
  .chip.icon-only {
    width: var(--scp-chip-height);
    padding: 0;
    justify-content: center;
  }
  /* A 44px touch target around the 30px chip, without making it look bigger. */
  .chip {
    position: relative;
  }
  .chip::after {
    content: "";
    position: absolute;
    inset: -7px -2px;
  }

  /* ---- Sections ---- */
  .section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 6px 4px 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.2px;
    color: var(--secondary-text-color);
    --mdc-icon-size: 14px;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* ---- Rows ---- */
  .row {
    --c: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: var(--scp-row-height);
    border-radius: var(--scp-control-radius);
    transition: background-color var(--scp-motion-normal) var(--scp-ease);
  }
  .row:hover {
    background: var(--scp-neutral-bg);
  }
  .main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    padding: 0 4px 0 8px;
    border-radius: var(--scp-control-radius);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    outline: none;
  }
  .main:focus-visible {
    box-shadow: inset 0 0 0 2px var(--scp-accent);
  }
  .disc {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--scp-neutral-bg);
    color: var(--c);
    transition: color var(--scp-motion-slow) var(--scp-ease), background-color var(--scp-motion-slow) var(--scp-ease);
    --mdc-icon-size: 20px;
  }
  .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .name {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .secondary {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* Colour by status: only the icon, and the word "Active". */
  .row.active {
    --c: var(--scp-accent);
  }
  .row.active .disc {
    background: color-mix(in srgb, var(--scp-accent) 16%, transparent);
  }
  .row.active .secondary {
    color: var(--scp-accent);
  }
  .row.unavailable {
    --c: var(--scp-warn);
  }
  .row.unavailable .secondary {
    color: var(--scp-warn);
  }
  /* Running: the icon breathes until Home Assistant answers (meaningful motion only). */
  .row.running .disc ha-icon {
    animation: scp-breathe 700ms var(--scp-ease) infinite alternate;
  }
  .row.done {
    --c: var(--scp-ok);
  }
  @keyframes scp-breathe {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.35;
    }
  }

  /* ---- Run and ⋯ buttons ---- */
  .run,
  .more {
    flex: none;
    width: 40px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--scp-control-radius);
    color: var(--secondary-text-color);
    transition: background-color var(--scp-motion-normal) var(--scp-ease), color var(--scp-motion-normal) var(--scp-ease),
      transform var(--scp-motion-fast) var(--scp-ease);
    --mdc-icon-size: 20px;
  }
  .run:hover,
  .more:hover,
  .more[aria-expanded="true"] {
    background: var(--scp-neutral-bg-hover);
    color: var(--primary-text-color);
  }
  .run:active {
    transform: scale(0.92);
  }
  .run[disabled] {
    cursor: default;
    opacity: 0.4;
  }

  /* ---- Menu (a popover in the top layer, so no card can clip it) ---- */
  .menu {
    position: fixed;
    inset: auto;
    margin: 0;
    box-sizing: border-box;
    min-width: 230px;
    max-width: min(320px, calc(100vw - 16px));
    max-height: min(480px, calc(100vh - 16px));
    overflow-y: auto;
    padding: 6px;
    border: 1px solid var(--divider-color);
    border-radius: var(--scp-control-radius);
    /* HA's own surface for things that float (dialogs): frosted in Pulse Glass, solid elsewhere. */
    background: var(--ha-dialog-surface-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
    -webkit-backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
    backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
  }
  .menu:not(:popover-open):not(.open) {
    display: none;
  }
  .menu-head {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    --mdc-icon-size: 16px;
  }
  .menu-head button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px 4px 2px;
    margin: -4px 0;
    border-radius: 8px;
  }
  .menu-head button:hover {
    background: var(--scp-menu-fill);
  }
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: calc(var(--scp-control-radius) - 4px);
    font-size: 14px;
    text-align: start;
    transition: background-color var(--scp-motion-fast) var(--scp-ease), color var(--scp-motion-fast) var(--scp-ease);
    --mdc-icon-size: 20px;
  }
  .item ha-icon {
    color: var(--secondary-text-color);
  }
  .item:hover,
  .item:focus-visible {
    outline: none;
    background: var(--scp-menu-fill);
  }
  .item.sure,
  .item.sure:hover {
    background: var(--scp-accent);
    color: var(--scp-on-accent);
  }
  .item.sure ha-icon {
    color: inherit;
  }
  .sep {
    height: 1px;
    margin: 4px 6px;
    background: var(--divider-color);
  }

  /* "What it sets": one quiet line per entity. */
  .targets {
    display: flex;
    flex-direction: column;
    padding: 0 4px 4px;
  }
  .target {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 36px;
    padding: 0 6px;
    font-size: 13px;
    --mdc-icon-size: 18px;
  }
  .target ha-icon {
    color: var(--secondary-text-color);
    flex: none;
  }
  .target .t-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .target .t-state {
    flex: none;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .target.matches .t-state {
    color: var(--scp-accent);
  }
  .note {
    padding: 6px 10px 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }

  /* ---- Empty ---- */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px 8px;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 13px;
    --mdc-icon-size: 28px;
  }
  .empty > ha-icon {
    opacity: 0.6;
    margin-bottom: 4px;
  }
  .empty .hint {
    font-size: 12px;
    opacity: 0.85;
  }
  .empty .chip {
    margin-top: 8px;
  }

  @media (prefers-reduced-motion: reduce) {
    .row,
    .disc,
    .chip,
    .run,
    .more,
    .item {
      transition: none;
    }
    .row.running .disc ha-icon {
      animation: none;
      opacity: 0.6;
    }
  }
`;
