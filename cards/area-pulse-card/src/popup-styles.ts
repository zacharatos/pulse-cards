import { css } from "lit";

export const popupStyles = css`
  dialog.apc-popup {
    --c: var(--apc-accent);
    padding: 0;
    border: none;
    background: transparent;
    width: min(640px, calc(100vw - 32px));
    max-width: none;
    max-height: min(80vh, 760px);
    color: var(--primary-text-color);
    overflow: visible;
  }
  dialog.apc-popup::backdrop {
    background: rgba(0, 0, 0, 0.45);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  dialog.apc-popup[open] .popup-surface {
    animation: apc-pop var(--apc-motion-normal, 200ms) cubic-bezier(0.2, 0.9, 0.3, 1.1);
  }
  @keyframes apc-pop {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
  }
  .popup-surface {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: min(80vh, 760px);
    padding: 20px;
    box-sizing: border-box;
    border-radius: var(--ha-dialog-border-radius, 28px);
    background: var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color, #fff)));
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
  .popup-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .popup-icon {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 22px;
  }
  .popup-icon.active {
    background: color-mix(in srgb, var(--c) 18%, transparent);
    color: var(--c);
  }
  .popup-titles { flex: 1; min-width: 0; }
  .popup-title { font-size: 20px; line-height: 26px; font-weight: 500; }
  .popup-sub { font-size: 13px; color: var(--secondary-text-color); }
  .popup-close {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    --mdc-icon-size: 22px;
  }
  .popup-close:hover { background: var(--apc-neutral-bg); }
  .popup-bulk { display: flex; gap: 8px; flex-wrap: wrap; }
  .bulk {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 14px 0 10px;
    border: none;
    border-radius: 18px;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    color: color-mix(in srgb, var(--c) 72%, var(--primary-text-color));
    background: color-mix(in srgb, var(--c) 16%, transparent);
    cursor: pointer;
    --mdc-icon-size: 18px;
  }
  .bulk:hover { background: color-mix(in srgb, var(--c) 24%, transparent); }
  /* chip_colors: state: a bulk button is an action, not a state. Neutral fill and text, the icon in the accent. */
  .bulk.calm { color: var(--primary-text-color); background: var(--apc-neutral-bg); }
  .bulk.calm:hover { background: var(--apc-neutral-bg-hover); }
  .bulk.calm ha-icon { color: var(--apc-accent); }
  .popup-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
    gap: 8px;
    overflow-y: auto;
    padding: 2px;
    margin: -2px;
  }

  /* Fallback tiles (only when HA's card helpers are unavailable) */
  .mini-tile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1px solid var(--divider-color);
    background: var(--ha-card-background, var(--card-background-color));
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    outline: none;
    --mdc-icon-size: 20px;
  }
  .mini-tile:focus-visible { box-shadow: 0 0 0 2px var(--c); }
  .mt-icon {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
  }
  .mini-tile.active .mt-icon {
    background: color-mix(in srgb, var(--c) 20%, transparent);
    color: var(--c);
  }
  .mt-text { min-width: 0; }
  .mt-name, .mt-state { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mt-name { font-size: 14px; font-weight: 500; line-height: 20px; }
  .mt-state { font-size: 12px; color: var(--secondary-text-color); line-height: 16px; }


  /* ---- Room popup -------------------------------------------------------- */
  dialog.apc-popup.room {
    width: min(760px, calc(100vw - 32px));
    max-height: none;
    height: min(88vh, 880px);
  }
  .room-surface {
    height: 100%;
    max-height: none;
    padding: 0;
    gap: 0;
    overflow: hidden;
  }
  .sheet-handle { display: none; }
  .room-head {
    flex: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 12px 12px 20px;
  }
  .room-icon {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 24px;
  }
  .room-icon.light-on {
    color: rgb(var(--room-rgb, var(--rgb-pulse-active, 255, 193, 7)));
    background: rgba(var(--room-rgb, var(--rgb-pulse-active, 255, 193, 7)), 0.18);
  }
  .room-head .climate { flex: none; }
  .room-head .popup-close { width: 44px; height: 44px; }
  .popup-sub .dot { margin: 0 4px; }

  .room-search {
    flex: none;
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 20px 8px;
    height: 44px;
    border-radius: 22px;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }
  .room-search > ha-icon { position: absolute; left: 14px; pointer-events: none; }
  .room-search input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: none;
    padding: 0 44px 0 44px;
    font: inherit;
    font-size: 15px;
    color: var(--primary-text-color);
    -webkit-appearance: none;
    appearance: none;
  }
  .room-search input::-webkit-search-cancel-button { display: none; }
  .room-search:focus-within { box-shadow: 0 0 0 2px color-mix(in srgb, var(--apc-accent) 70%, transparent); }
  .search-clear {
    position: absolute;
    right: 2px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .room-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0 20px 20px;
    -webkit-overflow-scrolling: touch;
  }
  .room-empty {
    padding: 40px 12px;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 14px;
  }

  .room-sec { padding-bottom: 8px; }
  /* Not sticky: a sticky header needs a painted background, which stacks on a translucent dialog
     (Pulse Glass) and shows as a lighter band, and backdrop blur doesn't apply inside the dialog. */
  .sec-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
  }
  .sec-toggle {
    flex: 1;
    min-width: 0;
    min-height: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 4px 0 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--primary-text-color);
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    --mdc-icon-size: 20px;
  }
  .sec-toggle:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
  /* chip_colors: state sets --apc-sec-icon (neutral, red for attention); category keeps the section colour. */
  .sec-icon { color: var(--apc-sec-icon, var(--c)); flex: none; }
  .sec-title { font-size: 15px; font-weight: 500; letter-spacing: 0.01em; }
  .sec-count { font-size: 12px; color: var(--secondary-text-color); }
  .sec-chevron { margin-left: auto; color: var(--secondary-text-color); flex: none; }
  .bulk.small { height: 32px; padding: 0 12px 0 8px; font-size: 12px; flex: none; --mdc-icon-size: 16px; }

  .sec-grid { display: grid; gap: 8px; padding: 2px 0 4px; }
  .sec-grid.tiles { grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr)); }
  .sec-grid.status { grid-template-columns: repeat(auto-fill, minmax(min(230px, 100%), 1fr)); }
  .sec-grid.stats { grid-template-columns: repeat(auto-fill, minmax(min(140px, 100%), 1fr)); }
  .sec-grid.status .mini-tile { padding: 6px 10px; min-height: 44px; box-sizing: border-box; }
  .sec-grid.status .mt-icon { width: 32px; height: 32px; }
  .tile-skel {
    min-height: 56px;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--apc-neutral-bg);
    animation: apc-pulse 1.2s ease-in-out infinite alternate;
  }
  @keyframes apc-pulse { to { opacity: 0.5; } }
  .sec-more {
    display: block;
    width: 100%;
    min-height: 40px;
    margin-top: 4px;
    border: none;
    border-radius: 12px;
    background: none;
    color: var(--apc-accent);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }
  .sec-more:hover { background: var(--apc-neutral-bg); }

  /* Stat cells: the value is what you look for. */
  .stat-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    min-height: 64px;
    padding: 8px 12px;
    box-sizing: border-box;
    border: none;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--apc-neutral-bg);
    color: var(--primary-text-color);
    font: inherit;
    text-align: left;
    cursor: pointer;
    min-width: 0;
    --mdc-icon-size: 16px;
  }
  .stat-cell:hover { background: var(--apc-neutral-bg-hover); }
  .stat-cell:focus-visible { outline: 2px solid var(--apc-accent); outline-offset: 1px; }
  .sc-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    min-width: 0;
  }
  .sc-label ha-state-icon { flex: none; }
  .sc-name, .sc-sub, .sc-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sc-value { font-size: 18px; line-height: 24px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .sc-sub { font-size: 11px; line-height: 14px; color: var(--secondary-text-color); opacity: 0.8; }
  .stat-cell.t-low .sc-value { color: var(--apc-temp-low); }
  .stat-cell.t-high .sc-value { color: var(--apc-temp-high); }
  .stat-cell.h-low .sc-value { color: var(--apc-hum-low); }
  .stat-cell.h-high .sc-value { color: var(--apc-hum-high); }
  .stat-cell.warn .sc-value { color: var(--apc-orange); }
  .stat-cell.bad .sc-value { color: var(--apc-red); }

  /* Phones: bottom sheet */
  @media (max-width: 600px) {
    dialog.apc-popup {
      width: 100vw;
      max-height: 85vh;
      margin: auto 0 0 0;
    }
    .popup-surface {
      max-height: 85vh;
      border-radius: var(--ha-dialog-border-radius, 28px) var(--ha-dialog-border-radius, 28px) 0 0;
      padding-bottom: calc(20px + env(safe-area-inset-bottom));
    }
    .popup-grid { grid-template-columns: 1fr 1fr; }

    /* Room popup: nearly full height, one column of controls, two columns of sensor values. */
    dialog.apc-popup.room {
      width: 100vw;
      height: 92vh;
      height: 92dvh;
      max-height: none;
      margin: auto 0 0 0;
    }
    .room-surface { padding-bottom: 0; border-radius: var(--ha-dialog-border-radius, 28px) var(--ha-dialog-border-radius, 28px) 0 0; }
    .sheet-handle {
      display: block;
      flex: none;
      width: 36px;
      height: 4px;
      margin: 8px auto 0;
      border-radius: 2px;
      background: var(--divider-color);
    }
    .room-head { padding: 8px 8px 8px 16px; gap: 8px; }
    .room-head .temp { font-size: 20px; line-height: 22px; }
    .room-search { margin: 0 16px 8px; }
    .room-body { padding: 0 16px calc(16px + env(safe-area-inset-bottom)); }
    .sec-grid.tiles, .sec-grid.status { grid-template-columns: 1fr; }
    .sec-grid.stats { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 360px) {
    .popup-grid { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    dialog.apc-popup[open] .popup-surface { animation: none; }
  }
`;
