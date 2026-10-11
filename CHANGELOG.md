# Changelog

Every release of Pulse Cards, newest first. The bundle has one version; the changes are grouped by card, so each card's story stays readable. Format: [Keep a Changelog](https://keepachangelog.com), versions: [Semantic Versioning](https://semver.org). The release workflow copies a version's section into its GitHub release, and refuses to release a version that has no section here.

Sections inside a version, only those that apply: **All cards**, **Area Pulse Card**, **Home Pulse Card**, **Home Pulse Shortcuts**, **Tile Pulse Card**, **Scene Pulse Card**, and one for each new card as it arrives (a new card's first entry is under *Added* in the release that brings it). Inside a section: *Added*, *Changed*, *Fixed*, *Removed*, and **Breaking** first when there is something the user has to act on.

## [1.1.0] - 2026-10-11

### Home Pulse Card

- **Added:** house modes as icons only, with `show_mode_names: false` (the name stays the tooltip). In the editor, a mode without a name now asks for the option it selects.
- **Added:** a "back to normal" mode, `mode_default`: that option gets no button, tapping the lit mode again selects it, and while it is current no mode is lit. What "normal" means stays with your automations.
- **Added:** `label_filter` (the same as Area Pulse Card's) for the home pulse, the alerts, the "Nobody's home" hints and the shortcut badges, so a humidifier's child lock no longer counts as an unlocked lock. In the editor under *Filter by labels*.

### Home Pulse Shortcuts

- **Added:** *Open view* is now Home Assistant's own picker, listing your dashboards and views; a typed path like `lights` still works.
- **Added:** a badge from any entity in the editor (a Stock Pulse "expiring soon" count, open tasks…), under the group list. YAML already took one; nothing changes there.

### Tile Pulse Card

- **Added:** `button_rows`: more rows of buttons under the first, each from its own entity (the purifier's mode on top, its fan level under it), with their own buttons and columns. In the editor under *More rows of buttons*.
- **Added:** `number` and `input_number` as option entities: a button sets a value, and one with 2–6 steps gives a button per step on its own.

### Scene Pulse Card

- **Fixed:** Undo for scenes from integrations (Hue and the like), which don't say which entities they set: the card now remembers what is in the scene's area, or the stored scene's entities.
- **Added:** an *Undo* chip in the header for two minutes after a run, so Undo no longer depends on catching the toast (which can hide behind a dialog).

## [1.0.0] - 2026-10-11

### All cards

- **One repository, one HACS download.** The four card repositories are now one: `zacharatos/pulse-cards`, with one bundle, `pulse-cards.js`, that holds every card. Card types, options and editors are unchanged, so dashboards keep working as they are. Coming from the old repositories: see "Coming from the separate card repositories" in the README.
- **Smaller download.** Lit is loaded once instead of once per card: 293 KB for all five cards, against 347 KB for the four separate bundles.
- **One console banner,** `PULSE-CARDS v1.0.0`, instead of one per card.
- **The home of every Pulse card from now on.** New cards are added here and arrive with an ordinary update; only the Pulse integrations (which bring their own card) and the theme keep repositories of their own.

### Area Pulse Card

- Same as `area-pulse-card` v1.3.6, the last release of its own repository.

### Home Pulse Card and Home Pulse Shortcuts

- Same as `home-pulse-card` v1.3.7, the last release of its own repository.

### Tile Pulse Card

- Same as `tile-pulse-card` v0.1.0, the last release of its own repository.

### Scene Pulse Card

- Same as `scene-pulse-card` v0.1.0, the last release of its own repository.

[1.1.0]: https://github.com/zacharatos/pulse-cards/releases/tag/v1.1.0
[1.0.0]: https://github.com/zacharatos/pulse-cards/releases/tag/v1.0.0
