import { css } from "lit";

export const popupStyles = css`
  dialog.hpc-popup {
    --c: var(--hpc-accent);
    padding: 0;
    border: none;
    background: transparent;
    width: min(640px, calc(100vw - 32px));
    max-width: none;
    max-height: min(80vh, 760px);
    color: var(--primary-text-color);
    overflow: visible;
  }
  dialog.hpc-popup::backdrop {
    background: rgba(0, 0, 0, 0.45);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  dialog.hpc-popup[open] .popup-surface {
    animation: hpc-pop 200ms cubic-bezier(0.2, 0.9, 0.3, 1.1);
  }
  @keyframes hpc-pop {
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
    background: var(--hpc-neutral-bg);
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
  .popup-close:hover { background: var(--hpc-neutral-bg); }
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
    /* A bulk button is an action, not a state: neutral fill and text, the icon in the accent (as in Area Pulse). */
    color: var(--primary-text-color);
    background: var(--hpc-neutral-bg);
    cursor: pointer;
    --mdc-icon-size: 18px;
  }
  .bulk ha-icon { color: var(--hpc-accent); }
  .bulk:hover { background: var(--hpc-neutral-bg-hover); }
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
    background: var(--hpc-neutral-bg);
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

  .popup-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow-y: auto;
    padding: 2px;
    margin: -2px;
  }
  .popup-body .popup-grid {
    overflow: visible;
  }
  .area-head {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    margin: 0 2px -6px;
  }

  @media (max-width: 600px) {
    dialog.hpc-popup {
      width: 100vw;
      max-width: 100vw;
      margin: auto 0 0;
    }
    .popup-surface {
      max-height: 86vh;
      border-radius: var(--ha-dialog-border-radius, 28px) var(--ha-dialog-border-radius, 28px) 0 0;
    }
  }
`;
