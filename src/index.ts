// Pulse Cards: one bundle, one HACS item. Each import defines its card's elements under their
// original names (custom:area-pulse-card, …) and adds them to the card picker, guarded so that a
// second copy of a card loaded alongside this bundle is skipped instead of throwing.
import "../cards/area-pulse-card/src/area-pulse-card";
import "../cards/home-pulse-card/src/home-pulse-card";
import "../cards/tile-pulse-card/src/tile-pulse-card";
import "../cards/scene-pulse-card/src/scene-pulse-card";
import { VERSION } from "./version";

// eslint-disable-next-line no-console
console.info(
  `%c PULSE-CARDS %c v${VERSION} `,
  "color:#fff;background:#03a9f4;font-weight:700;border-radius:4px 0 0 4px;padding:2px 4px",
  "color:#03a9f4;background:#fff0;font-weight:700;padding:2px 4px"
);
