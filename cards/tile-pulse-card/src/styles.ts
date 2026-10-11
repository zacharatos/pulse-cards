import { css } from "lit";

// Design: a native-looking tile on top, a calm row of buttons under it. Surfaces and text stay neutral;
// colour appears only where it means something: the main icon while its entity is on (Home Assistant's
// own state colour, like the native tile), and the icon of the lit button (the current mode). Shapes,
// radii, motion and the neutral steps match Area Pulse and Home Pulse cards.
export const cardStyles = css`
  :host {
    /* Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then a plain literal. Without the Pulse theme the card follows HA's theme. */
    --tpc-accent: var(--pulse-accent, var(--primary-color));
    --tpc-active: var(--pulse-active, var(--amber-color, #ffc107));
    --tpc-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 5%, transparent));
    --tpc-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 9%, transparent));
    --tpc-neutral-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --tpc-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --tpc-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --tpc-gap: var(--pulse-gap, 12px);
    --tpc-pad: var(--pulse-pad, 12px);
    --tpc-motion-fast: var(--pulse-motion-fast, 120ms);
    --tpc-motion-normal: var(--pulse-motion-normal, 200ms);
    --tpc-motion-slow: var(--pulse-motion-slow, 250ms);
    --tpc-ease: var(--pulse-ease, ease);
    display: block;
    height: 100%;
  }

  ha-card {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: calc(var(--tpc-gap) - 2px);
    padding: var(--tpc-pad);
    overflow: hidden;
  }

  button {
    font: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  /* ---- The tile ---- */
  .tile {
    --c: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 6px;
    margin: -6px;
    border-radius: var(--tpc-control-radius);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    outline: none;
    transition: background-color var(--tpc-motion-normal) var(--tpc-ease);
  }
  .tile:hover {
    background: var(--tpc-neutral-bg);
  }
  .tile:focus-visible {
    box-shadow: inset 0 0 0 2px var(--tpc-accent);
  }
  .tile.vertical {
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding: 10px 6px 6px;
    text-align: center;
  }

  .icon {
    flex: none;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: var(--tile-icon-border-radius, 50%);
    color: var(--c);
    background: var(--tpc-neutral-bg);
    cursor: pointer;
    transition: background-color var(--tpc-motion-slow) var(--tpc-ease), color var(--tpc-motion-slow) var(--tpc-ease),
      transform var(--tpc-motion-fast) var(--tpc-ease);
    --mdc-icon-size: 22px;
  }
  .vertical .icon {
    width: 42px;
    height: 42px;
    --mdc-icon-size: 24px;
  }
  .icon:hover {
    background: var(--tpc-neutral-bg-hover);
  }
  .icon:active {
    transform: scale(0.94);
  }
  .icon:focus-visible {
    outline: 2px solid var(--tpc-accent);
    outline-offset: 2px;
  }
  /* On: the entity's colour on the icon and, softly, behind it (like the native tile). */
  .tile.on .icon {
    background: color-mix(in srgb, var(--c) 18%, transparent);
  }
  .tile.on .icon:hover {
    background: color-mix(in srgb, var(--c) 26%, transparent);
  }
  .tile.unavailable .icon {
    opacity: 0.5;
  }

  .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .vertical .text {
    flex: none;
    width: 100%;
    align-items: center;
  }
  .name {
    max-width: 100%;
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
    max-width: 100%;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* ---- The buttons ---- */
  .actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .row {
    display: flex;
    gap: 8px;
  }
  .act {
    --c: var(--tpc-accent);
    flex: 1 1 0;
    min-width: 0;
    height: 48px;
    padding: 0 6px;
    box-sizing: border-box;
    border: none;
    border-radius: var(--tpc-control-radius);
    background: var(--tpc-neutral-bg);
    color: var(--secondary-text-color);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    /* Each button decides by its own width whether the name fits beside the icon. */
    container-type: inline-size;
    transition: background-color var(--tpc-motion-slow) var(--tpc-ease), color var(--tpc-motion-slow) var(--tpc-ease),
      transform var(--tpc-motion-fast) var(--tpc-ease);
    --mdc-icon-size: 20px;
  }
  .act.icon-only {
    height: 44px;
  }
  .act:hover:not(.disabled) {
    background: var(--tpc-neutral-bg-hover);
  }
  .act:active:not(.disabled) {
    transform: scale(0.97);
  }
  .act:focus-visible {
    outline: 2px solid var(--tpc-accent);
    outline-offset: -2px;
  }
  /* Lit (the current mode, or its entity is on): a stronger neutral fill and the text colour; the colour
     stays on the icon. Never a tinted fill, the family rule. */
  .act.active,
  .act.active:hover {
    color: var(--primary-text-color);
    background: var(--tpc-neutral-strong);
  }
  .act.active ha-icon,
  .act.active ha-state-icon {
    color: var(--c);
  }
  .act.disabled {
    opacity: 0.4;
    cursor: default;
  }
  /* A tap on its way: the icon breathes until the entity answers (at most a few seconds). */
  .act.pending ha-icon,
  .act.pending ha-state-icon {
    animation: tpc-breathe 900ms var(--tpc-ease) infinite alternate;
  }
  @keyframes tpc-breathe {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.35;
    }
  }

  .act-in {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 0;
  }
  .act-name {
    max-width: 100%;
    font-size: 11px;
    line-height: 14px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* Wide enough: icon beside the name, like the buttons of a native tile's features. */
  @container (min-width: 96px) {
    .act-in {
      flex-direction: row;
      gap: 8px;
    }
    .act-name {
      font-size: 13px;
      line-height: 18px;
    }
  }

  .warning {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    font-size: 14px;
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }
  .warning ha-icon {
    color: var(--warning-color, #ffa600);
  }

  @media (prefers-reduced-motion: reduce) {
    .tile,
    .icon,
    .act {
      transition: none;
    }
    .act.pending ha-icon,
    .act.pending ha-state-icon {
      animation: none;
      opacity: 0.6;
    }
  }
`;
