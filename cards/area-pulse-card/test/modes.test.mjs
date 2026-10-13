import test from "node:test";
import assert from "node:assert/strict";

import { defaultMode, guessModeIcon, modeEntityOf, resolveModes } from "../src/modes.ts";

const state = (entity_id, s, attributes = {}) => ({
  entity_id,
  state: s,
  attributes,
  last_changed: new Date().toISOString(),
  last_updated: new Date().toISOString(),
});

function makeHass(current = "Normal") {
  const states = {
    "input_select.kitchen_mode": state("input_select.kitchen_mode", current, { options: ["Normal", "Cooking", "Movie", "Bedtime"] }),
    "select.office_mode": state("select.office_mode", "Focus", { options: ["Focus", "Meeting"] }),
    "scene.kitchen_cooking": state("scene.kitchen_cooking", new Date(Date.now() - 60000).toISOString()),
    "scene.kitchen_dinner": state("scene.kitchen_dinner", new Date(Date.now() - 3600000).toISOString()),
  };
  return { states, entities: {}, devices: {}, areas: {}, language: "en" };
}
const cfg = (extra = {}) => ({ type: "custom:area-pulse-card", area: "kitchen", ...extra });

test("no mode_entity and no modes: no row (zero config looks exactly as before)", () => {
  assert.deepEqual(resolveModes(makeHass(), cfg()), []);
  assert.equal(modeEntityOf(cfg()), undefined);
  assert.equal(modeEntityOf(cfg({ mode_entity: "none" })), undefined);
});

test("a room's mode selector is never guessed from its name", () => {
  const hass = makeHass();
  assert.deepEqual(resolveModes(hass, cfg({ area: "kitchen" })), []);
});

test("one button per option, the current one lit, tapping selects it", () => {
  const modes = resolveModes(makeHass("Cooking"), cfg({ mode_entity: "input_select.kitchen_mode" }));
  assert.deepEqual(modes.map((m) => m.name), ["Normal", "Cooking", "Movie", "Bedtime"]);
  assert.deepEqual(modes.map((m) => m.active), [false, true, false, false]);
  assert.deepEqual(modes[2].tap_action, {
    action: "perform-action",
    perform_action: "input_select.select_option",
    target: { entity_id: "input_select.kitchen_mode" },
    data: { option: "Movie" },
  });
  assert.equal(modes[2].icon, "mdi:movie-open-outline");
  assert.equal(modes[3].icon, "mdi:weather-night");
});

test("works with a select entity too", () => {
  const modes = resolveModes(makeHass(), cfg({ mode_entity: "select.office_mode" }));
  assert.deepEqual(modes.map((m) => [m.name, m.active]), [["Focus", true], ["Meeting", false]]);
  assert.equal(modes[1].tap_action.perform_action, "select.select_option");
});

test("mode_default gets no button, tapping the lit mode goes back to it, and while current nothing is lit", () => {
  const config = cfg({ mode_entity: "input_select.kitchen_mode", mode_default: "Normal" });
  const cooking = resolveModes(makeHass("Cooking"), config);
  assert.deepEqual(cooking.map((m) => m.name), ["Cooking", "Movie", "Bedtime"]);
  assert.equal(cooking[0].resetTo, "Normal");
  assert.deepEqual(cooking[0].tap_action.data, { option: "Normal" });
  assert.deepEqual(cooking[1].tap_action.data, { option: "Movie" });
  assert.equal(cooking[1].resetTo, undefined);
  const normal = resolveModes(makeHass("Normal"), config);
  assert.ok(normal.every((m) => !m.active));
});

test("a mode_default the selector doesn't offer is ignored", () => {
  const hass = makeHass("Cooking");
  assert.equal(defaultMode(hass, cfg({ mode_entity: "input_select.kitchen_mode", mode_default: "Off" }), "input_select.kitchen_mode"), undefined);
  assert.equal(resolveModes(hass, cfg({ mode_entity: "input_select.kitchen_mode", mode_default: "Off" })).length, 4);
});

test("a modes list renames, picks icons and colours, and can run scenes instead of options", () => {
  const hass = makeHass("Cooking");
  const listed = resolveModes(hass, cfg({
    mode_entity: "input_select.kitchen_mode",
    modes: [{ option: "Cooking", name: "Cook", icon: "mdi:chef-hat", color: "orange" }, { name: "Movie" }, {}],
  }));
  assert.deepEqual(listed.map((m) => [m.name, m.icon, m.active]), [["Cook", "mdi:chef-hat", true], ["Movie", "mdi:movie-open-outline", false]]);
  assert.equal(listed[0].color, "orange");
  const scenes = resolveModes(hass, cfg({ modes: [{ entity: "scene.kitchen_cooking", name: "Cooking" }, { entity: "scene.kitchen_dinner", name: "Dinner" }] }));
  assert.deepEqual(scenes.map((m) => m.active), [true, false]);
  assert.equal(scenes[1].tap_action.perform_action, "scene.turn_on");
});

test("icons are guessed like Home Pulse's house modes", () => {
  assert.equal(guessModeIcon("Normal"), "mdi:home-outline");
  assert.equal(guessModeIcon("Ύπνος"), "mdi:weather-night");
  assert.equal(guessModeIcon("Gaming"), "mdi:circle-outline");
  // Room modes from the request: cooking, theater, reading; "theater" no longer reads as "eat".
  assert.equal(guessModeIcon("Cooking"), "mdi:chef-hat");
  assert.equal(guessModeIcon("Μαγείρεμα"), "mdi:chef-hat");
  assert.equal(guessModeIcon("Theater"), "mdi:movie-open-outline");
  assert.equal(guessModeIcon("Reading"), "mdi:book-open-page-variant-outline");
  assert.equal(guessModeIcon("Dinner"), "mdi:silverware-fork-knife");
  assert.equal(guessModeIcon("Eat"), "mdi:silverware-fork-knife");
  assert.equal(guessModeIcon("Breakfast"), "mdi:circle-outline");
});
