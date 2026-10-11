import type { HomeAssistant } from "./types";

type Dict = Record<string, string>;

const en: Dict = {
  title: "Scenes",
  just_now: "just now",
  never_ran: "Never run",
  active: "Active",
  running: "Running…",
  done: "Done",
  unavailable: "Needs a look",
  for_mode: "For {mode}",
  more_scenes: "More scenes",
  other: "Other",
  empty: "No scenes here yet.",
  empty_hint: "Pick some in the card editor, or give them the card's label.",
  empty_new: "New scene",
  new_scene: "New scene",
  mode_chip: "House mode: {mode}",
  run: "Run {name}",
  more: "More actions for {name}",

  // Menu
  menu_run: "Run",
  menu_undo: "Undo last run",
  menu_show: "What it sets",
  menu_update: "Update from now",
  menu_update_sure: "Tap again to replace it",
  menu_edit: "Edit scene",
  menu_more_info: "More info",
  back: "Back",
  targets_unknown: "Targets are visible to admins for scenes made in the UI.",
  matches_now: "Already like this",

  // Confirmations and toasts
  confirm_run: "Run {name}?",
  ran: "{name} is on",
  undo: "Undo",
  undone: "Put back as it was",
  updated: "{name} now holds how things are",
  error: "Couldn't do that: {error}",

  // Editor
  ed_title: "Title",
  ed_label: "Show scenes with these labels",
  ed_entities: "Show these scenes first",
  ed_exclude: "Never show",
  ed_group_by: "Group by",
  ed_group_none: "Nothing",
  ed_group_area: "Area",
  ed_group_label: "Label",
  ed_confirm: "Ask before running",
  ed_transition: "Fade lights in over (seconds)",
  ed_mode_entity: "House mode selector",
  ed_undo: "Offer Undo after a run",
  ed_hint: "The scenes you pick come first, then every scene with one of the labels. With neither, the card shows all your scenes.",
  ed_mode_hint: "Scenes with a label named like the current house mode (for example “Night”) are shown first.",
  ed_section_more: "More",
};

const el: Dict = {
  title: "Σκηνές",
  just_now: "μόλις τώρα",
  never_ran: "Δεν έχει τρέξει",
  active: "Ενεργή",
  running: "Εκτελείται…",
  done: "Έγινε",
  unavailable: "Θέλει έλεγχο",
  for_mode: "Για {mode}",
  more_scenes: "Άλλες σκηνές",
  other: "Άλλες",
  empty: "Δεν υπάρχουν ακόμη σκηνές εδώ.",
  empty_hint: "Διάλεξε κάποιες στον επεξεργαστή της κάρτας ή δώσ' τους την ετικέτα της κάρτας.",
  empty_new: "Νέα σκηνή",
  new_scene: "Νέα σκηνή",
  mode_chip: "Λειτουργία σπιτιού: {mode}",
  run: "Εκτέλεση: {name}",
  more: "Περισσότερες ενέργειες για {name}",

  menu_run: "Εκτέλεση",
  menu_undo: "Αναίρεση τελευταίας εκτέλεσης",
  menu_show: "Τι ρυθμίζει",
  menu_update: "Ενημέρωση από τώρα",
  menu_update_sure: "Πάτα ξανά για αντικατάσταση",
  menu_edit: "Επεξεργασία σκηνής",
  menu_more_info: "Πληροφορίες",
  back: "Πίσω",
  targets_unknown: "Οι τιμές φαίνονται στους διαχειριστές για σκηνές που φτιάχτηκαν από το UI.",
  matches_now: "Ήδη έτσι",

  confirm_run: "Εκτέλεση της σκηνής «{name}»;",
  ran: "Ενεργή: {name}",
  undo: "Αναίρεση",
  undone: "Επανήλθαν όπως ήταν",
  updated: "Η σκηνή «{name}» κράτησε ό,τι ισχύει τώρα",
  error: "Δεν έγινε: {error}",

  ed_title: "Τίτλος",
  ed_label: "Δείξε σκηνές με αυτές τις ετικέτες",
  ed_entities: "Δείξε πρώτα αυτές τις σκηνές",
  ed_exclude: "Να μην εμφανίζονται ποτέ",
  ed_group_by: "Ομαδοποίηση κατά",
  ed_group_none: "Καμία",
  ed_group_area: "Χώρο",
  ed_group_label: "Ετικέτα",
  ed_confirm: "Ερώτηση πριν την εκτέλεση",
  ed_transition: "Σταδιακό άναμμα φώτων (δευτερόλεπτα)",
  ed_mode_entity: "Επιλογέας λειτουργίας σπιτιού",
  ed_undo: "Πρόταση αναίρεσης μετά την εκτέλεση",
  ed_hint: "Πρώτα εμφανίζονται οι σκηνές που διαλέγεις, μετά όσες έχουν μία από τις ετικέτες. Χωρίς κανένα από τα δύο, η κάρτα δείχνει όλες τις σκηνές σου.",
  ed_mode_hint: "Οι σκηνές με ετικέτα που λέγεται όπως η τρέχουσα λειτουργία του σπιτιού (π.χ. «Νύχτα») εμφανίζονται πρώτες.",
  ed_section_more: "Περισσότερα",
};

const LANGS: Record<string, Dict> = { en, el };

export function language(hass?: HomeAssistant): string {
  return (hass?.locale?.language || hass?.language || "en").split("-")[0];
}

export function localize(hass: HomeAssistant | undefined, key: string, vars: Record<string, string | number> = {}): string {
  const lang = language(hass);
  const dict = LANGS[lang] ?? en;
  const k = vars.n === 1 && (dict[`${key}_one`] ?? en[`${key}_one`]) ? `${key}_one` : key;
  let s = dict[k] ?? en[k] ?? key;
  for (const [name, v] of Object.entries(vars)) s = s.replace(`{${name}}`, String(v));
  return s;
}

const locale = (hass?: HomeAssistant) => hass?.locale?.language || hass?.language || "en";

/** "3 minutes ago", "yesterday", localised by the browser. Same as the other Pulse cards. */
export function relativeTime(hass: HomeAssistant | undefined, iso: string, now = Date.now()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const secs = Math.round((t - now) / 1000);
  if (Math.abs(secs) < 45) return localize(hass, "just_now");
  const fmt = new Intl.RelativeTimeFormat(locale(hass), { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 365 * 86400],
    ["month", 30 * 86400],
    ["week", 7 * 86400],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) if (Math.abs(secs) >= size) return fmt.format(Math.round(secs / size), unit);
  return fmt.format(Math.round(secs / 60), "minute");
}
