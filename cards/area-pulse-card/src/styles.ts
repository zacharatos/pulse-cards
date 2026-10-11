import { css } from "lit";

export const cardStyles = css`
  :host {
    /* Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then the value this card always used. Without the Pulse theme nothing changes. */
    --apc-accent: var(--pulse-accent, var(--primary-color));
    /* Colours with a meaning: on (lights), needs a look, problem, all good, information. */
    --apc-amber: var(--pulse-active, var(--amber-color, #ffc107));
    --apc-orange: var(--pulse-warn, var(--orange-color, #ff9800));
    --apc-red: var(--pulse-bad, var(--red-color, #f44336));
    --apc-green: var(--pulse-ok, var(--green-color, #4caf50));
    --apc-blue: var(--pulse-info, var(--blue-color, #2196f3));
    /* Category colours: Home Assistant's palette (the Pulse theme mutes it). */
    --apc-deep-orange: var(--deep-orange-color, #ff6f22);
    --apc-light-blue: var(--light-blue-color, #03a9f4);
    --apc-cyan: var(--cyan-color, #00bcd4);
    --apc-teal: var(--teal-color, #009688);
    --apc-indigo: var(--indigo-color, #3f51b5);
    --apc-purple: var(--purple-color, #926bc7);
    /* Climate colouring: cold / warm, dry / humid. */
    --apc-temp-low: var(--pulse-cold, var(--apc-blue));
    --apc-temp-high: var(--pulse-warm, var(--apc-red));
    --apc-hum-low: var(--pulse-dry, #8fa4ae); /* white is invisible on a light card, so light themes get a pale blue-grey */
    --apc-hum-high: var(--pulse-humid, var(--apc-blue));
    /* Glow and the main light's icon when the light has no colour of its own; the card sets both inline
       when it does. --apc-glow-scale lets the theme soften every glow (Pulse's glow-alpha vs. our 0.16). */
    --apc-glow-rgb: var(--rgb-pulse-active, 255, 193, 7);
    --apc-light-rgb: var(--rgb-pulse-active, 255, 193, 7);
    --apc-glow-alpha: 0.16;
    --apc-glow-scale: calc(var(--pulse-glow-alpha, 0.16) / 0.16);
    --apc-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 6%, transparent));
    --apc-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    --apc-neutral-bg-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --apc-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --apc-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --apc-chip-height: var(--pulse-chip-height, 30px);
    --apc-gap: var(--pulse-gap, 12px);
    --apc-pad: var(--pulse-pad, 12px);
    /* Motion: the theme's rhythm, else the durations the card always used. */
    --apc-motion-fast: var(--pulse-motion-fast, 120ms);
    --apc-motion-normal: var(--pulse-motion-normal, 200ms);
    --apc-motion-slow: var(--pulse-motion-slow, 300ms);
    --apc-ease: var(--pulse-ease, ease);
    display: block;
    height: 100%;
  }
  :host([dark]) {
    --apc-hum-low: var(--pulse-dry, #ffffff);
  }

  ha-card {
    position: relative;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    container-type: inline-size;
    transition: box-shadow var(--apc-motion-slow) var(--apc-ease), border-color var(--apc-motion-slow) var(--apc-ease);
  }
  /* The banner carries the alert; the card's own edge (if the theme draws one) only turns red. */
  ha-card.alerting {
    border-color: var(--apc-red);
  }

  /* Ambient layers */
  .picture {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0.32;
    -webkit-mask-image: linear-gradient(to left, #000 0%, transparent 75%);
    mask-image: linear-gradient(to left, #000 0%, transparent 75%);
    pointer-events: none;
  }
  .glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity calc(var(--apc-motion-slow) * 2) var(--apc-ease);
    background: radial-gradient(
      140% 100% at 0% 0%,
      rgba(var(--apc-glow-rgb), calc(var(--apc-glow-alpha) * var(--apc-glow-scale))) 0%,
      transparent 58%
    );
  }
  .glow.on {
    opacity: 1;
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--apc-gap);
    padding: var(--apc-pad);
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    border-radius: var(--apc-control-radius);
    outline: none;
  }
  .header.clickable {
    cursor: pointer;
  }
  .header.clickable:focus-visible {
    box-shadow: 0 0 0 2px var(--apc-accent);
  }
  .area-icon {
    position: relative;
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    transition: background-color var(--apc-motion-slow) var(--apc-ease), color var(--apc-motion-slow) var(--apc-ease);
    --mdc-icon-size: 24px;
  }
  .area-icon.occupied {
    background: color-mix(in srgb, var(--apc-accent) 20%, transparent);
    color: var(--apc-accent);
  }
  .area-icon.linked {
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--apc-motion-slow) var(--apc-ease), color var(--apc-motion-slow) var(--apc-ease),
      transform var(--apc-motion-fast) var(--apc-ease);
  }
  .area-icon.linked:hover { background: var(--apc-neutral-bg-hover); }
  .area-icon.linked:active { transform: scale(0.94); }
  .area-icon.linked:focus-visible { box-shadow: 0 0 0 2px var(--apc-accent); }
  .area-icon.light-on,
  .area-icon.light-on:hover {
    background: rgba(var(--apc-light-rgb), 0.24);
    color: rgb(var(--apc-light-rgb));
  }
  .presence-dot {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: var(--apc-green);
    border: 2px solid var(--ha-card-background, var(--card-background-color, #fff));
    box-sizing: border-box;
  }
  .presence-dot::after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 2px solid var(--apc-green);
    opacity: 0;
    /* Once, when presence starts (the dot is created then); a constant ping is decoration. */
    animation: apc-ping 2.4s cubic-bezier(0, 0, 0.2, 1) 1;
  }
  @keyframes apc-ping {
    0% { transform: scale(1); opacity: 0.7; }
    80%, 100% { transform: scale(2.2); opacity: 0; }
  }
  .titles {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .name {
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .secondary {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .secondary .dot {
    margin: 0 4px;
    opacity: 0.6;
  }

  .climate {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    font-variant-numeric: tabular-nums;
  }
  .temp {
    display: flex;
    align-items: flex-start;
    font-size: 24px;
    line-height: 26px;
    font-weight: 400;
    letter-spacing: -0.5px;
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .temp .unit {
    font-size: 13px;
    line-height: 18px;
    margin-left: 1px;
    color: var(--secondary-text-color);
    letter-spacing: 0;
  }
  .temp.low { color: var(--apc-temp-low); }
  .temp.high { color: var(--apc-temp-high); }
  .hum {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    cursor: pointer;
    --mdc-icon-size: 14px;
  }
  .hum.low { color: var(--apc-hum-low); }
  .hum.high { color: var(--apc-hum-high); }
  /* Humidity and the sensor_classes readings: one small line under the temperature that wraps. */
  .readings {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    column-gap: 8px;
    row-gap: 0;
    max-width: 150px;
  }
  .hum { white-space: nowrap; }
  .reading.warn { color: var(--apc-orange); }
  .reading.bad { color: var(--apc-red); }

  /* Alert banner */
  .alert-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: var(--apc-control-radius);
    background: color-mix(in srgb, var(--apc-red) 14%, transparent);
    color: var(--apc-red);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    --mdc-icon-size: 20px;
  }
  .alert-banner ha-icon {
    /* A few blinks when the alert appears, then still: the banner itself keeps the attention. */
    animation: apc-blink 1.4s ease-in-out 3;
  }
  .alert-banner .text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @keyframes apc-blink {
    50% { opacity: 0.35; }
  }

  /* Status chips: one row capped at max_chips, or (max_chips: 0) two rows: openings & motion, then everything else */
  .chip-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    --c: var(--secondary-text-color);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--apc-chip-height);
    padding: 0 12px 0 9px;
    border-radius: calc(var(--apc-chip-height) / 2);
    border: none;
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
    background: var(--apc-neutral-bg);
    cursor: pointer;
    white-space: nowrap;
    max-width: 100%;
    box-sizing: border-box;
    transition: background-color var(--apc-motion-normal) var(--apc-ease), color var(--apc-motion-normal) var(--apc-ease),
      transform var(--apc-motion-fast) var(--apc-ease);
    --mdc-icon-size: 16px;
  }
  .chip:hover { background: var(--apc-neutral-bg-hover); }
  .chip:active { transform: scale(0.96); }
  .chip:focus-visible { outline: 2px solid var(--c); outline-offset: 1px; }
  .chip.active {
    /* Pull the hue toward the text colour so labels stay legible in light and dark themes. */
    color: color-mix(in srgb, var(--c) 72%, var(--primary-text-color));
    background: color-mix(in srgb, var(--c) 16%, transparent);
  }
  .chip.active:hover { background: color-mix(in srgb, var(--c) 24%, transparent); }
  .chip.selected { box-shadow: inset 0 0 0 1.5px var(--c); }
  /* chip_colors: state (default). Neutral fill and text; only the icon carries the meaning (--c). */
  .chip.calm.active {
    color: var(--primary-text-color);
    background: var(--apc-neutral-bg);
  }
  .chip.calm.active:hover { background: var(--apc-neutral-bg-hover); }
  .chip.calm.active ha-icon { color: var(--c); }
  /* "+N": the chips that didn't fit on the face; opens the room popup. */
  .chip.more { padding: 0 11px; font-variant-numeric: tabular-nums; }
  .chip .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Quick actions */
  .actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
    gap: 8px;
  }
  .action {
    --c: var(--apc-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 42px;
    padding: 0 10px;
    border: none;
    border-radius: var(--apc-control-radius);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-text-color);
    background: var(--apc-neutral-bg);
    cursor: pointer;
    min-width: 0;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: background-color var(--apc-motion-normal) var(--apc-ease), color var(--apc-motion-normal) var(--apc-ease),
      transform var(--apc-motion-fast) var(--apc-ease);
    --mdc-icon-size: 20px;
  }
  /* --apc-action-icon: neutral when idle with chip_colors: state (actionIconColor). */
  .action ha-icon { color: var(--apc-action-icon, var(--c)); flex: none; }
  .action:hover { background: var(--apc-neutral-bg-hover); }
  .action:active { transform: scale(0.96); }
  .action:focus-visible { outline: 2px solid var(--c); outline-offset: 1px; }
  /* Like an active tile: a stronger neutral fill, colour stays on the icon. */
  .action.active,
  .action.active:hover {
    background: var(--apc-neutral-bg-strong);
  }
  .action[disabled] { opacity: 0.4; cursor: default; pointer-events: none; }
  .action .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Four or more actions: stacked icon-over-label buttons so a row of 4–5 fits */
  .actions.dense { grid-template-columns: repeat(auto-fit, minmax(64px, 1fr)); gap: 6px; }
  .actions.dense .action {
    flex-direction: column;
    height: 58px;
    gap: 3px;
    padding: 0 4px;
    font-size: 11px;
  }
  .actions.dense .action .label { max-width: 100%; }

  /* Narrow cards: icon-only actions */
  @container (max-width: 300px) {
    .actions, .actions.dense { grid-template-columns: repeat(auto-fit, minmax(44px, 1fr)); }
    .action, .actions.dense .action { height: 42px; }
    .action .label { display: none; }
  }

  /* Compact layout */
  :host([layout="compact"]) .content { gap: 8px; padding: 10px; }
  :host([layout="compact"]) .area-icon { width: 36px; height: 36px; --mdc-icon-size: 20px; }
  :host([layout="compact"]) .name { font-size: 14px; line-height: 20px; }
  :host([layout="compact"]) .temp { font-size: 18px; line-height: 20px; }
  :host([layout="compact"]) .chip { height: 26px; padding: 0 9px 0 7px; }
  :host([layout="compact"]) .chip:not(.active) .label { display: none; }
  :host([layout="compact"]) .chip:not(.active) { padding: 0 6px; }
  :host([layout="compact"]) .chip.more { padding: 0 9px; }
  :host([layout="compact"]) .chip.more .label { display: inline; }
  :host([layout="compact"]) .action { height: 36px; }
  :host([layout="compact"]) .actions,
  :host([layout="compact"]) .actions.dense { grid-template-columns: repeat(auto-fit, minmax(40px, 1fr)); }
  :host([layout="compact"]) .actions.dense .action { height: 36px; }
  :host([layout="compact"]) .action .label { display: none; }

  .hint {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: var(--apc-control-radius);
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 16px;
    --mdc-icon-size: 18px;
  }
  .hint ha-icon { flex: none; }

  .warning {
    padding: 16px;
    color: var(--warning-color, #ffa600);
    display: flex;
    gap: 8px;
    align-items: center;
  }

  @media (prefers-reduced-motion: reduce) {
    .presence-dot::after, .alert-banner ha-icon { animation: none; }
  }
`;
