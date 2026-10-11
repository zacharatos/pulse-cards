// Small bridges to Home Assistant's frontend.

/** Make sure HA's lazily-loaded form elements exist (ha-form, ha-selector). */
export async function loadHaElements(): Promise<void> {
  if (customElements.get("ha-form") && customElements.get("ha-selector")) return;
  try {
    const helpers = await (window as unknown as { loadCardHelpers?: () => Promise<any> }).loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: "entities", entities: [] });
    await card?.constructor?.getConfigElement?.();
  } catch {
    /* the dashboard usually has them loaded already */
  }
}

export function fireEvent(node: HTMLElement, type: string, detail?: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

/** HA's own toast at the bottom of the screen, optionally with one action button (e.g. "Undo"). */
export function toast(node: HTMLElement, message: string, action?: { text: string; action: () => void }, duration?: number): void {
  fireEvent(node, "hass-notification", { message, ...(action ? { action } : {}), ...(duration ? { duration } : {}) });
}

export function errorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) return String((err as { message: unknown }).message);
  return String(err);
}
