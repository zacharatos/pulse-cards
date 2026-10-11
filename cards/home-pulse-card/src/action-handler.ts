import { noChange } from "lit";
import { Directive, directive, type ElementPart, type PartInfo, PartType } from "lit/directive.js";

export type ActionKind = "tap" | "hold" | "double_tap";

export interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleTap?: boolean;
  disabled?: boolean;
}

interface HandlerElement extends HTMLElement {
  __hpcOptions?: ActionHandlerOptions;
  __hpcBound?: boolean;
}

const HOLD_MS = 500;
const DOUBLE_TAP_MS = 250;

function bind(el: HandlerElement) {
  if (el.__hpcBound) return;
  el.__hpcBound = true;
  let holdTimer: number | undefined;
  let tapTimer: number | undefined;
  let held = false;
  let startX = 0;
  let startY = 0;

  const emit = (action: ActionKind) =>
    el.dispatchEvent(new CustomEvent("hpc-action", { detail: { action }, bubbles: false, composed: false }));
  const clearHold = () => {
    if (holdTimer) window.clearTimeout(holdTimer);
    holdTimer = undefined;
  };

  el.addEventListener("pointerdown", (ev: PointerEvent) => {
    if (el.__hpcOptions?.disabled || ev.button !== 0) return;
    held = false;
    startX = ev.clientX;
    startY = ev.clientY;
    if (el.__hpcOptions?.hasHold) {
      holdTimer = window.setTimeout(() => {
        held = true;
        holdTimer = undefined;
        if (navigator.vibrate) navigator.vibrate(30);
        emit("hold");
      }, HOLD_MS);
    }
  });
  el.addEventListener("pointermove", (ev: PointerEvent) => {
    if (holdTimer && (Math.abs(ev.clientX - startX) > 10 || Math.abs(ev.clientY - startY) > 10)) clearHold();
  });
  el.addEventListener("pointercancel", clearHold);
  el.addEventListener("pointerleave", clearHold);
  el.addEventListener("contextmenu", (ev) => {
    if (el.__hpcOptions?.hasHold) ev.preventDefault();
  });
  el.addEventListener("pointerup", (ev: PointerEvent) => {
    if (el.__hpcOptions?.disabled || ev.button !== 0) return;
    const wasPending = !!holdTimer;
    clearHold();
    if (held) {
      held = false;
      return;
    }
    if (!wasPending && el.__hpcOptions?.hasHold) return; // cancelled by movement
    if (el.__hpcOptions?.hasDoubleTap) {
      if (tapTimer) {
        window.clearTimeout(tapTimer);
        tapTimer = undefined;
        emit("double_tap");
      } else {
        tapTimer = window.setTimeout(() => {
          tapTimer = undefined;
          emit("tap");
        }, DOUBLE_TAP_MS);
      }
    } else {
      emit("tap");
    }
  });
  el.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (el.__hpcOptions?.disabled) return;
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      emit("tap");
    }
  });
}

class ActionHandlerDirective extends Directive {
  constructor(info: PartInfo) {
    super(info);
    if (info.type !== PartType.ELEMENT) throw new Error("actionHandler must be used on an element");
  }
  update(part: ElementPart, [options]: [ActionHandlerOptions?]) {
    const el = part.element as HandlerElement;
    el.__hpcOptions = options ?? {};
    bind(el);
    return noChange;
  }
  render(_options?: ActionHandlerOptions) {
    return noChange;
  }
}

/** Tap / hold / double-tap detection, emitting an `hpc-action` event on the element. */
export const actionHandler = directive(ActionHandlerDirective);
