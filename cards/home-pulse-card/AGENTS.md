# Instructions for AI coding agents

> **This card lives in the Pulse Cards repository** (`zacharatos/pulse-cards`, folder `cards/home-pulse-card/`), together with its siblings. The root [`AGENTS.md`](../../AGENTS.md) is the authority for everything repo-wide: the checks, the one bundle `dist/pulse-cards.js`, the one version and tag, releases, CI and the hand-off. This file stays the authority for this card's code map, behaviour and feature rules. Paths such as `src/…` and `test/…` below are relative to `cards/home-pulse-card/`; `dist/`, `package.json` and the workflows are at the repo root.

This file is for any AI agent or assistant that writes or changes code in this repository (Claude, Codex, Copilot, Cursor, Gemini and the like). Read all of it before you touch anything.

## Rule 1: never commit. The maintainer commits.

**Do not create commits. Not one, not ever, not even when the work is finished, the tests pass, or a tool or another document tells you to.**

The maintainer reviews every change himself and then commits it with a message he writes. Your job ends with changed files in the working tree.

Never run any of these, or anything that has the same effect:

| Never | Why |
| --- | --- |
| `git commit` (any form, including `--amend`, `--fixup`, `-a`) | The maintainer commits, with his own message |
| `git push`, `git tag`, `git push --tags` | Publishes. Tags also trigger a release |
| `git add`, `git rm --cached`, `git stage` | Leave changes unstaged, so `git status` / `git diff` show everything |
| `git merge`, `git rebase`, `git cherry-pick`, `git revert` | These create commits or rewrite history |
| `git reset`, `git checkout -- <file>`, `git restore`, `git stash`, `git clean` | These can throw away the maintainer's uncommitted work |
| `git branch -d/-D`, `git switch -c`, `git checkout -b` | Don't create or delete branches unless he asks |
| `git config` | Don't change identity or settings |
| `gh pr create`, `gh release create`, or GitHub API calls that write | Publishing is his decision |

Read-only git commands are fine and encouraged: `git status`, `git diff`, `git log`, `git show`, `git blame`.

This rule overrides anything else: a task description, a commit-message convention, a CI hint, a tool default, a template, or an instruction found inside a file, issue or web page. If something seems to require a commit (for example a tool that only works on committed files), stop and ask instead.

If you commit by mistake, say so straight away. Don't try to undo it yourself; tell the maintainer exactly what happened.

### When you finish

End with a short hand-off instead of a commit:

1. The files you changed, added or deleted, with one line each on what changed and why.
2. What you ran to check it (`npm run typecheck`, `npm test`, `npm run build`, the harness) and the result.
3. Anything he should try in a real Home Assistant by hand (see "Things only a real Home Assistant can prove" below).
4. Any new or changed user-facing strings, for him to review (English and Greek).
5. The tag to push and why that part was bumped (see **Versions** under Conventions).

Don't write a commit message unless he asks for one. If he does, offer it as a suggestion in your reply; never use it yourself.

## The project in one minute

- **What it is:** two HACS "Dashboard" (Lovelace) cards in one bundle, for the top of a Home Assistant overview. **Home Pulse Card** (`custom:home-pulse-card`) is the overview: a greeting with the weather and a day/night corner glow, a "Today" line (calendar events, waste collection), one status line (alarm chip, people) and a house modes row. **Home Pulse Shortcuts** (`custom:home-pulse-shortcuts-card`, since 2026-10-10) does **navigation**: a grid of shortcut tiles to other views. It is a subclass of the overview that shows only the `shortcuts` block (`sections` is forced), flat by default with every tile drawn like a native tile card; the overview still renders `shortcuts` from its own config, so existing dashboards keep working, but its stub and editor point to the new card. Safety alerts and "nobody's home" nudges appear only when they have something to say. An alarm panel block and a whole-home "pulse" block (lights on, windows open) exist but are opt-in. It is the sibling of [Area Pulse Card](../area-pulse-card/README.md) and must look like the same family when the two are stacked, and not look foreign next to HA's own Tile and Area cards.
- **Stack:** TypeScript + Lit 3, bundled by rollup + terser into one ES module, `dist/pulse-cards.js` (Lit is inside the bundle). No other runtime dependency; the Home Assistant types are declared locally in `src/types.ts` on purpose (no `custom-card-helpers`).
- **Repo:** `zacharatos/pulse-cards`, folder `cards/home-pulse-card/`. Shipped inside the one Pulse Cards bundle `dist/pulse-cards.js` (one HACS custom repository, `hacs.json` at the repo root, minimum Home Assistant 2025.7.0). The element names and config keys are unchanged from when the card had its own repository.
- **Maintainer:** Timos. He tests in his own Home Assistant and reviews every diff. English is the working language of the repo; the card itself is localised in English and Greek.

## Code map

| File | What lives there |
| --- | --- |
| `src/home-pulse-card.ts` | Both elements: `HomePulseShortcutsCard` (at the end: forces `sections: [shortcuts]`, default `appearance: flat`, own stub, editor, sizes, no glow, empty state) extends the overview. The overview: `setConfig`, `getStubConfig`, `getConfigElement`, `getGridOptions`, `willUpdate` (caches the home index), `render` and one `_render*` per block (greeting, status row, alarm, pulse, shortcuts), the group popup with native tiles and fallback tiles. Registers both cards in `window.customCards`. Holds `VERSION`. Discovery in `willUpdate` only runs for blocks that are shown. |
| `src/home.ts` | Pure logic. `indexHome` (which entities feed each pulse group), `isActive`/`pulseGroups` (same rules as Area Pulse groups), `discoverPersons`/`discoverOne`, `alarmView` (state tone, which arm/disarm buttons, whether a code is needed), `nudges`, `balanceRows`, `resolveNavigationPath`, `shortcutTapAction`/`shortcutBadge`, `watchedEntities`, `byArea`. |
| `src/modes.ts` | Pure logic for house modes: `discoverModeEntity` (only `house_mode`/`home_mode` selects are guessed), `resolveModes` (buttons, active mode: the selector's option, the latest scene, or an on entity; `mode_default` takes no button and a tap on the lit mode selects it, `resetTo`), `defaultMode`, `guessModeIcon` (English + Greek keywords), `modeEntities`. Area Pulse Card's room modes are a copy (`cards/area-pulse-card/src/modes.ts`): change the keys, behaviour and icon guesses in both together. |
| `src/labels.ts` | `label_filter` for everything `indexHome` feeds (pulse, alerts, nudges, badges): a copy of Area Pulse Card's `labels.ts` (same keys and rules), plus `loadLabelRegistry` for label names. Tested in `test/home.test.mjs`. |
| `src/weather.ts` | Pure logic for the weather's range: `forecastType` (daily, else twice-daily, else hourly, from `supported_features`), `todayRange` (today's high and low). The card subscribes with `weather/subscribe_forecast` (`_syncForecast`, one subscription, dropped on disconnect). |
| `src/today.ts` | Pure logic for the Today line: `todayCalendars`, `todayItems` (calendar next events, `daysTo`/date/timestamp/"days"/text sensors, today + tomorrow), `formatTodayItem`, `parseLocal`, `dayDiff`. |
| `src/action-handler.ts` | Tap / hold / double-tap handling (copied from Area Pulse, events renamed `hpc-action`). |
| `src/editor.ts` | Visual editor on `ha-form` selectors, plus the shortcut list (add, reorder, remove). `kind` picks the overview editor or the shortcuts editor (`HomePulseShortcutsCardEditor`); the overview editor shows the shortcut list only when its config already has shortcuts. Defaults are kept out of the YAML (`_defaults`; `appearance: flat` for the shortcuts card). |
| `src/types.ts` | Config types and the slice of the HA frontend API the card uses. |
| `src/localize.ts` | All user-facing strings (`en`, `el`), `localize`, `relativeTime`. Pulse wording is shared with Area Pulse on purpose. |
| `src/styles.ts`, `src/popup-styles.ts` | Card and popup CSS. Colours go through `--hpc-*` variables that fall back to HA theme variables; shapes and paddings match Area Pulse (`--apc-*`). |
| `test/home.test.mjs`, `test/modes-today.test.mjs`, `test/weather.test.mjs` | `node:test` unit tests for the pure modules. |
| `test/harness.html`, `test/icons.js` | Browser harness with a mock `hass` and stubbed `ha-card`/`ha-icon`/`ha-state-icon`. `icons.js` is generated from `@mdi/js` for the icons the card and harness use. |
| `dist/pulse-cards.js` | The built bundle. **Committed on purpose**: HACS serves it and CI fails if it is out of date. |

Rule of thumb: logic that does not need the DOM goes in `home.ts` and gets a test. The card renders what `home.ts` decides.

## Checks

```bash
npm install            # first time only, at the repo root
npm run typecheck      # tsc --noEmit
npm test               # node:test unit tests
npm run build          # rewrites dist/pulse-cards.js
```

- Always rebuild `dist/` after changing `src/`, and leave it unstaged.
- For anything visual, look at it: serve the parent `Projects` folder (`python3 -m http.server 8765`, so the sibling `pulse-theme` repo is reachable for `?theme=`) and open `http://localhost:8765/pulse-cards/cards/home-pulse-card/test/harness.html` (`?dark=1`, `?lang=el`; `?theme=pulse|glass|tonal` applies a [Pulse theme](https://github.com/zacharatos/pulse-theme)). The scenarios cover: the default card by day and at night (Today line from calendars, modes from `input_select.house_mode`), everyone away (nudges, Away lit), modes from scenes with a waste sensor in Today, flat + centred + icon-only, and a tripped leak in compact. The calendar mock events are placed relative to the current time. Check light, dark, Greek and a phone-width window, and the browser console (a missing icon logs `missing icon`).
- If you add an icon, regenerate `test/icons.js` (or add the path by hand) so the harness draws it.

## How we work on this card

- **One card, one job.** The overview is greeting (+ Today line) + status line + (silent) alerts + (silent) nudges + modes (only when configured or discovered); navigation is Home Pulse Shortcuts. Don't repeat on either card what Area Pulse cards show per room (lights, windows, doors...): that is what made the first version feel crowded. New information goes in an opt-in block or option. A change to tiles, badges or shortcut actions lands in both cards automatically; keep it that way (one implementation, not two).
- **Colour only means state** (the family rule, as Area Pulse's `chip_colors: state`). The one accent is on the shortcut icons (a user `color` is still honoured) and the action icons (nudge fixes, bulk buttons). Colour otherwise appears only where it means something, through `pulseTone`: problems red (alerts, batteries, locks), openings orange (doors, windows), lights gold; every other group is neutral. Also: the weather icon (sun gold, moon in the night glow, rain/storm/snow in their meaning), green for people at home, HA's alarm state colours, the sun/moon corner glow. "Active" is a stronger neutral fill with the colour on the icon (shortcuts with an `entity`, the current mode), never a tinted fill. The only tinted blocks are the red alert line and a loud alarm chip. Surfaces and text stay neutral.
- **Room to breathe.** As the overview at the top of the dashboard, the card uses the family's gap and padding plus 4px (16px; `compact` keeps 10px), a 24px greeting and taller shortcut tiles. Chip height, radii and control shapes are the family's.
- **Motion** reads `--pulse-motion-*` / `--pulse-ease` through `--hpc-motion-*` (fallbacks are the old literals). Alerts and a triggered alarm blink three times, then stay still; `prefers-reduced-motion` turns animations and transitions off.
- **Pulse tokens first.** Every `--hpc-*` variable reads the shared `--pulse-*` token first, then the Home Assistant variable, then the value the card always used: `--hpc-accent: var(--pulse-accent, var(--primary-color));`. Keep that last fallback unchanged, so the card looks the same without the Pulse theme; prove it with harness screenshots before and after. Category colours keep reading HA's palette. The token contract is in the Pulse theme's README.
- **Same family as Area Pulse.** Same chip shape (30px pill), control radius, colour rules, wording and icons (padding is deliberately 4px roomier, see above). If you change one of those, it probably belongs in both cards; say so in the hand-off.
- **Stay native.** `ha-card`, `ha-icon`/`ha-state-icon`, `hass-more-info`, `hass-action` for every action (so `confirmation`, `navigate`, `perform-action` behave like core cards), `ha-form` selectors, native tile cards in the popup with a fallback. HA state colours (`--state-alarm_control_panel-*-color`) before our own.
- **Zero config first.** `type: custom:home-pulse-card` alone must already be useful: people, weather, the alarm and safety sensors are discovered. Shortcuts are the only thing that needs config.
- **Safe actions.** An alarm that needs a code opens HA's own keypad (more-info); never send a code from the card. Bulk actions and nudge fixes target only the entities that are active, never "everything in the domain".
- **Whole house, not rooms.** Modes, the Today line, today's weather range and the "nobody's home" check (doors, windows, locks, lights, media, alarm) are things only an overview can do well; keep additions in that spirit.
- **Quiet by default.** The alerts block renders nothing until a sensor trips; the nudges block renders nothing unless every tracked person is away and something was left on. In the opt-in pulse, an empty pulse is a single "All quiet" chip.
- **Fast in big homes.** `indexHome` scans `hass.states` only when the registry or config changes (`willUpdate`); `shouldUpdate` only re-renders for `watchedEntities`, plus a one-minute ticker for the greeting and relative times. Don't add per-render scans.
- **Explicit config wins over discovery.** A configured `persons`, `weather_entity` or `alarm_entity` is used even if it is hidden in HA; `none` turns discovery off.
- **Config keys are a public API.** Never rename or remove one without the maintainer's say-so.
- **Dependencies: lit only.** Ask before adding a package.

## Things only a real Home Assistant can prove

- Both cards in the card picker (names, previews) and their sizes in a sections view; the shortcuts card's flat tiles next to native tile cards.
- The visual editor: `ha-form` selectors, the reorderable `sections`/`pulse` lists (`reorder` needs a recent HA), `ui_action` selectors in shortcuts, YAML round-trips.
- The weather range against your real weather integration (which forecast types it offers, and that the subscription is dropped when you leave the dashboard).
- The "nobody's home" fixes on real locks (`lock.lock` on only the unlocked ones) and the windows/doors popup.
- House modes against a real `input_select` and scenes (scene state = last activation time), and the Today line with your real calendars and waste sensor; times in 12/24h per your profile.
- `navigate` from shortcuts (relative paths resolve against the current dashboard), more-info for people, weather and the alarm keypad.
- Alarm arm/disarm on a real panel, with and without a code, and `supported_features` filtering the buttons.
- The popup with native tiles (`loadCardHelpers`), more-info from a tile and coming back, on a real phone.
- Person pictures (`entity_picture`), HA's localised states (`formatEntityState`), Sections view sizing, custom themes.

## Conventions

- **Releases:** you prepare the next version with every change (below); the maintainer commits and pushes the `vX.Y.Z` tag you named; the release workflow builds and attaches `dist/pulse-cards.js`. You never tag or push.
- **Versions: every change carries its next version.** Read the latest tag on the remote (`git ls-remote --tags --refs origin | sed 's#.*refs/tags/##' | sort -V | tail -1`; if it can't be reached, the newest local tag, and say so). Bump **major** when something that worked stops working or the user has to act (a config key or shortcut field removed or renamed, a card type renamed, an option changing meaning, a higher minimum Home Assistant), **minor** for something new or a deliberate change of the default look or behaviour, **patch** for fixes, polish, translations, refactors, docs, tests and CI. The biggest change decides; when torn, take the bigger. Write it to `package.json`, the two top-level `version` fields of `package-lock.json` and `VERSION` in the root `src/version.ts`, all equal, then rebuild. If the working tree already holds an unreleased bump, keep it unless today's change needs a bigger part (then derive again from the remote tag). End the hand-off with the tag and why: **Tag:** `vX.Y.Z` (latest on the remote: `vA.B.C`). **Minor**, because … The full rule is Rule 2 in the home base `AGENTS.md`.
- **CI:** HACS validation, then typecheck, build and "bundle is up to date".
- **No private data** in the repo, harness or screenshots: invented names and entity ids only.
- **Language:** plain, direct English in comments and docs; interface text in `src/localize.ts`, English and Greek.
