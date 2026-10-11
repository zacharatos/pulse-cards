# Pulse Cards

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz)

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=zacharatos&repository=pulse-cards&category=plugin)

![Pulse Cards on a dashboard, with the Pulse Glass theme](https://raw.githubusercontent.com/zacharatos/pulse-cards/main/docs/hero-dark.jpg)

A calm family of dashboard cards for Home Assistant, in one download. **Every Pulse card lives here, today's and every one still to come**; only the Pulse integrations, which bring their own card, have repositories of their own. They share one look (the same radii, chip shapes, motion and colour rules), read the [Pulse theme](https://github.com/zacharatos/pulse-theme)'s `--pulse-*` tokens first and fall back to your own theme, and sit comfortably next to Home Assistant's native cards.

The cards so far (more are on the way, and each new one arrives in this same download):

| Card | Type | What it is for |
| :- | :- | :- |
| [Area Pulse Card](cards/area-pulse-card/README.md) | `custom:area-pulse-card` | One room at a glance: presence, climate, openings, alerts, what's on, quick actions, and the whole room in a popup. |
| [Home Pulse Card](cards/home-pulse-card/README.md) | `custom:home-pulse-card` | The top of the dashboard: greeting and weather, the Today line, alarm and people, house modes, quiet hints. |
| [Home Pulse Shortcuts](cards/home-pulse-card/README.md) | `custom:home-pulse-shortcuts-card` | Large shortcut tiles to your other views, with live badges. |
| [Tile Pulse Card](cards/tile-pulse-card/README.md) | `custom:tile-pulse-card` | One entity as a tile, with a row of buttons for its modes, presets or any action, the current one lit. |
| [Scene Pulse Card](cards/scene-pulse-card/README.md) | `custom:scene-pulse-card` | Your scenes in a calm list: run, undo, see which one is active, edit or re-capture them. |

| Area Pulse | Home Pulse |
| :-: | :-: |
| ![Area Pulse Card](https://raw.githubusercontent.com/zacharatos/pulse-cards/main/cards/area-pulse-card/docs/light.png) | ![Home Pulse Card](https://raw.githubusercontent.com/zacharatos/pulse-cards/main/cards/home-pulse-card/docs/light.png) |
| **Tile Pulse** | **Scene Pulse** |
| ![Tile Pulse Card](https://raw.githubusercontent.com/zacharatos/pulse-cards/main/cards/tile-pulse-card/docs/light.png) | ![Scene Pulse Card](https://raw.githubusercontent.com/zacharatos/pulse-cards/main/cards/scene-pulse-card/docs/light.png) |

## One home for every Pulse card

This repository is where the Pulse cards live, and it is meant to grow. The rule is simple:

- **A card is a card → it comes here.** Every new Pulse card, whatever it does, is added to this repository as a new folder under `cards/` and ships in the same `pulse-cards.js`. Install Pulse Cards once and each new card turns up in your card picker with the next update; there is no new repository to add, no new resource, nothing to configure.
- **An integration → its own repository.** When a component has to keep state, run on its own with no dashboard open, or create entities, actions or events, it is an integration, and HACS allows only one integration per repository. Its card comes inside it. Today that is [Stock Pulse](https://github.com/zacharatos/stock-pulse-integration) (household inventory and shopping list) and [Flow Pulse](https://github.com/zacharatos/flow-pulse) (automations).
- **The theme** is a HACS theme, so [Pulse Theme](https://github.com/zacharatos/pulse-theme) has its own repository too. Every card here reads its `--pulse-*` tokens first.

New cards are listed in [CHANGELOG.md](CHANGELOG.md) under the release that brings them. A new card is a minor release: it adds something and changes nothing you already use.

## How these cards are made

**Built with AI coding agents, tested by a person, in a real home.** I design every card: what it is for, how it looks, how it behaves. AI coding agents (mostly Claude) write a large part of the code, following written rules that are public in this repository ([`AGENTS.md`](AGENTS.md)). Before anything reaches you:

- **I review every change and commit it myself.** The agents are not allowed to commit, tag or release; a person decides what ships.
- **It passes the checks:** type checking, unit tests for the logic of every card, a build, and the HACS validation, on every push.
- **I look at it** in each card's test page with invented data: light and dark, English and Greek, phone width, each Pulse theme.
- **It runs on my own Home Assistant first.** Every release is installed and used at home, and fine-tuned there, before it is tagged for everyone. If something only works in a demo, it doesn't ship.

Found something that doesn't behave in *your* home? [Open an issue](https://github.com/zacharatos/pulse-cards/issues/new/choose): every home is different, and that is exactly the feedback the agents can't give me.

## Installation

### HACS (custom repository)

1. Click the **Open in HACS** button above, or: HACS → ⋮ → **Custom repositories** → add `https://github.com/zacharatos/pulse-cards`, type **Dashboard**.
2. Search for **Pulse Cards** → **Download**. HACS adds one dashboard resource, `/hacsfiles/pulse-cards/pulse-cards.js`, which holds every card, including the ones added later.
3. Reload the browser (clear the cache if the cards don't show up in the card picker). The browser console shows `PULSE-CARDS vX.Y.Z`.

### Manual

1. Copy `dist/pulse-cards.js` to `<config>/www/pulse-cards.js`.
2. Settings → Dashboards → ⋮ → **Resources** → add `/local/pulse-cards.js` as a *JavaScript module*.

Requires Home Assistant **2025.7+**. Each card's README lists anything extra it needs.

### Coming from the separate card repositories

Until October 2026 each card had its own repository (`area-pulse-card`, `home-pulse-card`, `tile-pulse-card`, `scene-pulse-card`). The cards inside Pulse Cards are the same cards with the same names and options, so **dashboards need no change**. Only the download changes:

1. Install **Pulse Cards** as above.
2. In HACS, remove the old **Area Pulse Card**, **Home Pulse Card**, **Tile Pulse Card** and **Scene Pulse Card**. Then check Settings → Dashboards → ⋮ → **Resources** and delete any old `area-pulse-card.js`, `home-pulse-card.js`, `tile-pulse-card.js` or `scene-pulse-card.js` entry that is left, including `/local/…` ones you added by hand.
3. Reload the browser; in the companion app, *Settings → Companion app → Troubleshooting → Reset frontend cache*.

While an old resource is still loaded, it wins: the card it holds is defined first and the bundle quietly skips it (nothing breaks, nothing is defined twice). So if the console still shows `AREA-PULSE-CARD`, `HOME-PULSE-CARD`, `TILE-PULSE-CARD` or `SCENE-PULSE-CARD` next to `PULSE-CARDS`, step 2 isn't finished.

## Configuration

Each card is configured on its own, exactly as before; see its README:
[Area Pulse](cards/area-pulse-card/README.md#configuration) ·
[Home Pulse and Shortcuts](cards/home-pulse-card/README.md#configuration) ·
[Tile Pulse](cards/tile-pulse-card/README.md#configuration) ·
[Scene Pulse](cards/scene-pulse-card/README.md#configuration).
All of them also have a visual editor.

## Development

```
pulse-cards/
├─ cards/<card>/          one folder per card (a new card = a new folder): src/, test/ (unit tests + harness), docs/ (screenshots), README.md, AGENTS.md
├─ src/index.ts           the bundle's entry: imports every card, prints the one console banner
├─ src/version.ts         the one version
├─ dist/pulse-cards.js    the built bundle (committed: HACS serves it)
├─ test/                  the hook that lets Node run the TypeScript sources directly
└─ scripts/               version and changelog checks for CI
```

```bash
npm install          # first time only
npm run typecheck    # tsc --noEmit, every card
npm test             # node:test, every card's unit tests
npm run build        # writes dist/pulse-cards.js
npm run watch        # rebuild on change
```

Every card has a browser harness that renders it against an invented home: serve the parent folder (`python3 -m http.server 8765` from the folder that also holds `pulse-theme`) and open `http://localhost:8765/pulse-cards/cards/<card>/test/harness.html`, with `?dark=1`, `?lang=el` and `?theme=pulse|glass|tonal`. Each card's README lists its own extra options.

## Versions and changes

Pulse Cards has **one version** for the whole bundle, following [Semantic Versioning](https://semver.org) as seen from your dashboards: major when something that worked stops working or you have to act, minor for something new, patch for fixes. What changed in each release is in [CHANGELOG.md](CHANGELOG.md), card by card, and on the GitHub release page.

## License

MIT, see [LICENSE](LICENSE).
