import type { HomeAssistant } from "./types";

type Dict = Record<string, string>;

const en: Dict = {
  just_now: "just now",
  unavailable: "Unavailable",
  missing_entity: "Entity not found: {entity}",
  pick_entity: "Pick an entity in the editor",

  // Editor
  ed_entity: "Entity",
  ed_name: "Name",
  ed_icon: "Icon",
  ed_color: "Colour while on",
  ed_vertical: "Icon above the name",
  ed_state_content: "Line under the name",
  ed_info_entities: "Also show the state of",
  ed_content_state: "State",
  ed_content_last_changed: "Last changed",
  ed_content_last_updated: "Last updated",
  ed_tap_action: "Tap",
  ed_hold_action: "Hold",
  ed_double_tap_action: "Double tap",
  ed_icon_tap_action: "Tap on the icon",
  ed_section_tile: "Tile",
  ed_section_interactions: "Interactions",
  ed_section_actions: "Buttons",
  ed_action_entity: "Options from",
  ed_columns: "Buttons per row",
  ed_show_names: "Show names",
  ed_hide_actions_when_off: "Hide buttons while off",
  ed_option: "Option",
  ed_action_n: "Button {n}",
  ed_add_action: "Add button",
  ed_remove: "Remove",
  ed_move_up: "Up",
  ed_move_down: "Down",
  ed_auto_hint: "One button per option of {entity}. Add or customise to choose your own.",
  ed_auto_none: "Add buttons that set an option, run a scene or script, toggle an entity or do any action.",
  ed_customize: "Customise these buttons",
  ed_actions_hint: "A button with an option sets it on its entity (or on “Options from”). Without an option it toggles or runs its entity.",
};

const el: Dict = {
  just_now: "μόλις τώρα",
  unavailable: "Μη διαθέσιμο",
  missing_entity: "Δεν βρέθηκε η οντότητα: {entity}",
  pick_entity: "Διάλεξε οντότητα στον επεξεργαστή",

  ed_entity: "Οντότητα",
  ed_name: "Όνομα",
  ed_icon: "Εικονίδιο",
  ed_color: "Χρώμα όταν είναι αναμμένο",
  ed_vertical: "Εικονίδιο πάνω από το όνομα",
  ed_state_content: "Γραμμή κάτω από το όνομα",
  ed_info_entities: "Δείξε και την κατάσταση των",
  ed_content_state: "Κατάσταση",
  ed_content_last_changed: "Τελευταία αλλαγή",
  ed_content_last_updated: "Τελευταία ενημέρωση",
  ed_tap_action: "Πάτημα",
  ed_hold_action: "Παρατεταμένο πάτημα",
  ed_double_tap_action: "Διπλό πάτημα",
  ed_icon_tap_action: "Πάτημα στο εικονίδιο",
  ed_section_tile: "Πλακίδιο",
  ed_section_interactions: "Αλληλεπιδράσεις",
  ed_section_actions: "Κουμπιά",
  ed_action_entity: "Επιλογές από",
  ed_columns: "Κουμπιά ανά σειρά",
  ed_show_names: "Εμφάνιση ονομάτων",
  ed_hide_actions_when_off: "Κρύψε τα κουμπιά όταν είναι σβηστό",
  ed_option: "Επιλογή",
  ed_action_n: "Κουμπί {n}",
  ed_add_action: "Προσθήκη κουμπιού",
  ed_remove: "Αφαίρεση",
  ed_move_up: "Πάνω",
  ed_move_down: "Κάτω",
  ed_auto_hint: "Ένα κουμπί για κάθε επιλογή του {entity}. Πρόσθεσε ή προσάρμοσε για να διαλέξεις τα δικά σου.",
  ed_auto_none: "Πρόσθεσε κουμπιά που αλλάζουν μια επιλογή, τρέχουν σκηνή ή script, ανάβουν/σβήνουν μια οντότητα ή κάνουν οποιαδήποτε ενέργεια.",
  ed_customize: "Προσάρμοσε αυτά τα κουμπιά",
  ed_actions_hint: "Ένα κουμπί με επιλογή την ορίζει στην οντότητά του (ή στο «Επιλογές από»). Χωρίς επιλογή ανάβει/σβήνει ή τρέχει την οντότητά του.",
};

const LANGS: Record<string, Dict> = { en, el };

export function localize(
  hass: HomeAssistant | undefined,
  key: string,
  vars: Record<string, string | number> = {}
): string {
  const lang = language(hass);
  let s = LANGS[lang]?.[key] ?? en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

export function language(hass?: HomeAssistant): string {
  return (hass?.locale?.language || hass?.language || "en").split("-")[0];
}

/** "3 minutes ago", "yesterday", localised by the browser. Same as Home Pulse Card. */
export function relativeTime(hass: HomeAssistant | undefined, iso: string, now = Date.now()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const secs = Math.round((t - now) / 1000);
  if (Math.abs(secs) < 45) return localize(hass, "just_now");
  const fmt = new Intl.RelativeTimeFormat(hass?.locale?.language || hass?.language || "en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) if (Math.abs(secs) >= size) return fmt.format(Math.round(secs / size), unit);
  return fmt.format(Math.round(secs / 60), "minute");
}
