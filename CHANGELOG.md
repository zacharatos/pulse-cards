# Changelog

Every release of Pulse Cards, newest first. The bundle has one version; the changes are grouped by card, so each card's story stays readable. Format: [Keep a Changelog](https://keepachangelog.com), versions: [Semantic Versioning](https://semver.org). The release workflow copies a version's section into its GitHub release, and refuses to release a version that has no section here.

Sections inside a version, only those that apply: **All cards**, **Area Pulse Card**, **Home Pulse Card**, **Home Pulse Shortcuts**, **Tile Pulse Card**, **Scene Pulse Card**. Inside a section: *Added*, *Changed*, *Fixed*, *Removed*, and **Breaking** first when there is something the user has to act on.

## [1.0.0] - 2026-10-11

### All cards

- **One repository, one HACS download.** The four card repositories are now one: `zacharatos/pulse-cards`, with one bundle, `pulse-cards.js`, that holds every card. Card types, options and editors are unchanged, so dashboards keep working as they are. Coming from the old repositories: see "Coming from the separate card repositories" in the README.
- **Smaller download.** Lit is loaded once instead of once per card: 293 KB for all five cards, against 347 KB for the four separate bundles.
- **One console banner,** `PULSE-CARDS v1.0.0`, instead of one per card.

### Area Pulse Card

- Same as `area-pulse-card` v1.3.6, the last release of its own repository.

### Home Pulse Card and Home Pulse Shortcuts

- Same as `home-pulse-card` v1.3.7, the last release of its own repository.

### Tile Pulse Card

- Same as `tile-pulse-card` v0.1.0, the last release of its own repository.

### Scene Pulse Card

- Same as `scene-pulse-card` v0.1.0, the last release of its own repository.

[1.0.0]: https://github.com/zacharatos/pulse-cards/releases/tag/v1.0.0
