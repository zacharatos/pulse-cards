import test from "node:test";
import assert from "node:assert/strict";

import { buildGroups, indexArea } from "../src/discovery.ts";
import { resolveLabelFilter } from "../src/labels.ts";
import { actionIconColor, resolveAction } from "../src/presets.ts";

const state = (entity_id, s = "off", attributes = {}) => ({
  entity_id,
  state: s,
  attributes,
  last_changed: new Date().toISOString(),
  last_updated: new Date().toISOString(),
});

function makeHass() {
  const ids = {
    "light.ceiling": { labels: ["on_card"] },
    "light.lamp": {},
    "light.strip": {},
    "switch.heater": { labels: ["on_card"] },
    "sensor.noise": { labels: ["on_card"] },
  };
  const states = {};
  const entities = {};
  for (const [id, extra] of Object.entries(ids)) {
    states[id] = state(id, id.startsWith("sensor") ? "3" : "on");
    entities[id] = { entity_id: id, area_id: "lounge", ...extra };
  }
  return { states, entities, devices: {}, areas: {}, language: "en" };
}

const area = { area_id: "lounge", name: "Lounge" };

function resolve(preset, filterCfg) {
  const hass = makeHass();
  const filter = resolveLabelFilter(filterCfg);
  const index = indexArea(hass, "lounge", [], filter);
  const groups = buildGroups(hass, {}, index);
  return resolveAction(hass, { preset }, area, groups, index, filter.active);
}

test("presets target the whole area when no label filter is set", () => {
  assert.deepEqual(resolve("lights_off").tap_action.target, { area_id: "lounge" });
  assert.deepEqual(resolve("everything_off").tap_action.target, { area_id: "lounge" });
});

test("with a label filter, presets only touch the entities the card shows", () => {
  const filter = { include: ["on_card"] };
  assert.deepEqual(resolve("lights_off", filter).tap_action.target, { entity_id: ["light.ceiling"] });
  assert.deepEqual(resolve("lights_toggle", filter).tap_action.target, { entity_id: ["light.ceiling"] });
  const all = resolve("everything_off", filter).tap_action;
  assert.equal(all.perform_action, "homeassistant.turn_off");
  assert.deepEqual([...all.target.entity_id].sort(), ["light.ceiling", "switch.heater"]);
  assert.ok(all.confirmation, "everything_off still asks for confirmation");
});

test("quick-action icons follow the tile rule: colour only while something is on", () => {
  const neutral = "var(--secondary-text-color)";
  // Lights are on in the fixture, so the toggle is active and keeps its gold icon.
  assert.equal(actionIconColor(resolve("lights_toggle"), true), "var(--apc-amber)");
  // Stateless presets never colour their icon.
  for (const p of ["lights_on", "lights_off", "everything_off", "covers_close"])
    assert.equal(actionIconColor(resolve(p), true), neutral, p);
  // An idle action is neutral; chip_colors: category keeps today's coloured icons.
  const idle = { active: false, color: "var(--apc-teal)" };
  assert.equal(actionIconColor(idle, true), neutral);
  assert.equal(actionIconColor(idle, false), "var(--apc-teal)");
  assert.equal(actionIconColor(resolve("everything_off"), false), "var(--apc-red)");
});
