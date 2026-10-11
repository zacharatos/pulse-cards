// Label filtering for the home-wide groups. Pure logic only (no DOM), tested in test/labels.test.mjs.
// A copy of Area Pulse Card's labels.ts (same config shape and rules), as the family's helpers are kept
// per card for now (root AGENTS.md, "Known duplication").

import type { HomeAssistant, LabelFilterConfig, LabelRegistryEntry } from "./types";

export interface ResolvedLabelFilter {
  /** True when there is anything to filter on. */
  active: boolean;
  include: Set<string>;
  exclude: Set<string>;
  match: "any" | "all";
  fromDevice: boolean;
  /** The include labels as the user wrote them, for messages. */
  includeNames: string[];
}

export const NO_LABEL_FILTER: ResolvedLabelFilter = {
  active: false,
  include: new Set(),
  exclude: new Set(),
  match: "any",
  fromDevice: true,
  includeNames: [],
};

/** Accept `foo`, `[foo, bar]` or nothing. Blank entries are dropped. */
export function toList(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : value == null ? [] : [value];
  return raw.map((v) => String(v).trim()).filter(Boolean);
}

/** True when the config asks for any label filtering at all. */
export function hasLabelFilter(cfg?: LabelFilterConfig): boolean {
  return !!cfg && (toList(cfg.include).length > 0 || toList(cfg.exclude).length > 0);
}

function toLabelId(token: string, registry?: LabelRegistryEntry[]): string {
  if (!registry) return token;
  const byId = registry.find((l) => l.label_id === token);
  if (byId) return byId.label_id;
  const lower = token.toLowerCase();
  const byName = registry.find((l) => l.name.toLowerCase() === lower);
  return byName ? byName.label_id : token;
}

/**
 * Turn the user's config into label IDs. Tokens may be IDs (what the visual editor writes) or display
 * names (friendlier in YAML). Without a registry every token is treated as an ID.
 */
export function resolveLabelFilter(
  cfg: LabelFilterConfig | undefined,
  registry?: LabelRegistryEntry[]
): ResolvedLabelFilter {
  if (!hasLabelFilter(cfg)) return NO_LABEL_FILTER;
  const include = toList(cfg!.include);
  const exclude = toList(cfg!.exclude);
  return {
    active: true,
    include: new Set(include.map((t) => toLabelId(t, registry))),
    exclude: new Set(exclude.map((t) => toLabelId(t, registry))),
    match: cfg!.match === "all" ? "all" : "any",
    fromDevice: cfg!.from_device !== false,
    includeNames: include,
  };
}

/** Does an entity (with its device's labels) pass the filter? Exclusion always wins. */
export function passesLabelFilter(
  entityLabels: readonly string[] | undefined,
  deviceLabels: readonly string[] | undefined,
  filter: ResolvedLabelFilter
): boolean {
  if (!filter.active) return true;
  const have = new Set<string>(entityLabels ?? []);
  if (filter.fromDevice) for (const l of deviceLabels ?? []) have.add(l);
  for (const l of filter.exclude) if (have.has(l)) return false;
  if (filter.include.size === 0) return true;
  const wanted = [...filter.include];
  return filter.match === "all" ? wanted.every((l) => have.has(l)) : wanted.some((l) => have.has(l));
}

// The label registry is not part of `hass`; fetch it once and share it between cards.
let registryPromise: Promise<LabelRegistryEntry[]> | undefined;

export function loadLabelRegistry(hass: HomeAssistant): Promise<LabelRegistryEntry[]> {
  if (!hass.callWS) return Promise.resolve([]);
  if (!registryPromise) {
    registryPromise = hass
      .callWS<LabelRegistryEntry[]>({ type: "config/label_registry/list" })
      .catch((err) => {
        registryPromise = undefined; // allow a retry on the next card load
        throw err;
      });
  }
  return registryPromise;
}
