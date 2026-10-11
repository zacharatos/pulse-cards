// Pure logic for the house modes row: which buttons, which one is active, what a tap does.
import type { ActionConfig, HassEntity, HomeAssistant, HomePulseCardConfig, ModeConfig } from "./types";

export interface ResolvedMode {
  name: string;
  icon: string;
  color?: string;
  active: boolean;
  entity?: string;
  tap_action: ActionConfig;
  hold_action?: ActionConfig;
}

const domainOf = (id: string) => id.split(".")[0];

/** Icons guessed from the mode name, in English and Greek. First match wins. */
const ICON_GUESSES: [RegExp, string][] = [
  [/away|leave|εκτός|έξω|απουσ/i, "mdi:home-export-outline"],
  [/night|sleep|bed|νύχτ|ύπνο|βράδ/i, "mdi:weather-night"],
  [/movie|cinema|film|tv|ταινί|σινεμ/i, "mdi:movie-open-outline"],
  [/guest|visit|επισκ|καλεσμ/i, "mdi:account-group-outline"],
  [/vacation|holiday|travel|διακοπ|ταξίδ/i, "mdi:airplane"],
  [/morning|wake|πρωί|ξύπνη/i, "mdi:weather-sunset-up"],
  [/work|office|focus|δουλει|γραφεί/i, "mdi:briefcase-outline"],
  [/party|πάρτ/i, "mdi:party-popper"],
  [/dinner|eat|φαγητ|δείπν/i, "mdi:silverware-fork-knife"],
  [/home|σπίτι|normal|κανονικ|day|ημέρα/i, "mdi:home-outline"],
];

export function guessModeIcon(name: string): string {
  for (const [re, icon] of ICON_GUESSES) if (re.test(name)) return icon;
  return "mdi:circle-outline";
}

/**
 * The mode entity: the configured one, or a visible input_select/select called house_mode or
 * home_mode. Nothing else is guessed (an "ac_mode" select is not a house mode).
 */
export function discoverModeEntity(hass: HomeAssistant, config: HomePulseCardConfig): string | undefined {
  if (config.mode_entity === "none") return undefined;
  if (config.mode_entity) return config.mode_entity;
  return Object.keys(hass.states).find(
    (id) =>
      (domainOf(id) === "input_select" || domainOf(id) === "select") &&
      /(^|\.|_)(house|home)_mode$/.test(id) &&
      !hass.entities?.[id]?.hidden
  );
}

function entityAction(entity: string): ActionConfig {
  const d = domainOf(entity);
  if (d === "scene" || d === "script") return { action: "perform-action", perform_action: `${d}.turn_on`, target: { entity_id: entity } };
  if (d === "button" || d === "input_button") return { action: "perform-action", perform_action: `${d}.press`, target: { entity_id: entity } };
  if (d === "input_select" || d === "select" || d === "automation") return { action: "more-info", entity };
  return { action: "toggle", entity };
}

/** Scenes report the time they were last activated as their state. */
function sceneTime(s?: HassEntity): number {
  const t = s ? Date.parse(s.state) : NaN;
  return Number.isNaN(t) ? -Infinity : t;
}

export function resolveModes(hass: HomeAssistant, config: HomePulseCardConfig): ResolvedMode[] {
  const me = discoverModeEntity(hass, config);
  const meState = me ? hass.states[me] : undefined;
  // A mode just added in the editor is still empty: it draws nothing until it says what it does.
  const listed = (config.modes ?? []).filter((m) => m && (m.name || m.option || m.entity || m.tap_action));
  const items: ModeConfig[] = listed.length
    ? listed
    : ((meState?.attributes.options as string[] | undefined) ?? []).map((option) => ({ option }));
  // Among scene buttons, the most recently activated scene is "the current mode".
  const sceneIds = items.map((m) => m.entity).filter((e): e is string => !!e && domainOf(e) === "scene");
  const latestScene = sceneIds.reduce<string | undefined>(
    (best, id) => (sceneTime(hass.states[id]) > sceneTime(best ? hass.states[best] : undefined) ? id : best),
    undefined
  );

  return items.map((m) => {
    const option = m.option ?? (me && !m.entity && !m.tap_action ? m.name : undefined);
    const entityState = m.entity ? hass.states[m.entity] : undefined;
    const name = m.name ?? option ?? String(entityState?.attributes.friendly_name ?? m.entity ?? "");
    const icon = m.icon ?? (entityState?.attributes.icon as string | undefined) ?? guessModeIcon(name);
    let tap: ActionConfig = { action: "none" };
    let active = false;
    if (m.tap_action) tap = m.tap_action;
    else if (option !== undefined && me) {
      tap = {
        action: "perform-action",
        perform_action: `${domainOf(me)}.select_option`,
        target: { entity_id: me },
        data: { option },
      };
    } else if (m.entity) tap = entityAction(m.entity);

    if (option !== undefined && meState) active = meState.state === option;
    else if (m.entity && domainOf(m.entity) === "scene") active = m.entity === latestScene && sceneTime(entityState) > -Infinity;
    else if (entityState) active = entityState.state === "on";

    return { name, icon, color: m.color, active, entity: m.entity ?? me, tap_action: tap, hold_action: m.hold_action };
  });
}

/** Entities the modes row depends on. */
export function modeEntities(hass: HomeAssistant, config: HomePulseCardConfig): string[] {
  const out: string[] = [];
  const me = discoverModeEntity(hass, config);
  if (me) out.push(me);
  for (const m of config.modes ?? []) if (m.entity) out.push(m.entity);
  return out;
}
