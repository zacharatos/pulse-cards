import test from "node:test";
import assert from "node:assert/strict";

import { buildGroups, findMainLight, indexArea } from "../src/discovery.ts";
import { resolveLabelFilter } from "../src/labels.ts";

const state = (entity_id, s = "off", attributes = {}) => ({
  entity_id,
  state: s,
  attributes,
  last_changed: new Date().toISOString(),
  last_updated: new Date().toISOString(),
});

function makeHass() {
  const states = {};
  const entities = {};
  const add = (id, area, extra = {}, s = "off", attrs = {}) => {
    states[id] = state(id, s, attrs);
    entities[id] = { entity_id: id, area_id: area, ...extra };
  };
  // Hundreds of entities in the area, only a few of them labelled.
  for (let i = 0; i < 200; i++) add(`sensor.noise_${i}`, "lounge", {}, "1", { device_class: "power" });
  add("light.lounge_ceiling", "lounge", { labels: ["on_card"] }, "on");
  add("light.lounge_lamp", "lounge", {}, "on");
  add("binary_sensor.lounge_window", "lounge", { device_id: "dev_win" }, "on", { device_class: "window" });
  add("binary_sensor.lounge_window_battery", "lounge", { device_id: "dev_win", entity_category: "diagnostic" }, "on", {
    device_class: "battery",
  });
  add("light.elsewhere", "kitchen", { labels: ["on_card"] }, "on");
  const devices = { dev_win: { id: "dev_win", area_id: null, labels: ["on_card"] } };
  return { states, entities, devices, areas: {}, language: "en" };
}

test("without a label filter every entity of the area is indexed", () => {
  const hass = makeHass();
  const index = indexArea(hass, "lounge");
  assert.equal(index.primary.length, 200 + 3);
  assert.equal(index.unfilteredCount, index.primary.length);
});

test("an include filter keeps only labelled entities, labels from devices included", () => {
  const hass = makeHass();
  const filter = resolveLabelFilter({ include: "on_card" });
  const index = indexArea(hass, "lounge", [], filter);
  assert.deepEqual(index.primary.sort(), ["binary_sensor.lounge_window", "light.lounge_ceiling"]);
  assert.equal(index.unfilteredCount, 203);
});

test("battery sensors follow their device's label", () => {
  const hass = makeHass();
  const filter = resolveLabelFilter({ include: "on_card" });
  const index = indexArea(hass, "lounge", [], filter);
  assert.ok(index.withDiagnostic.includes("binary_sensor.lounge_window_battery"));
  const groups = buildGroups(hass, { type: "x", area: "lounge" }, index);
  assert.equal(groups.batteries?.active.length, 1);
});

test("the filter never leaks entities from other areas", () => {
  const hass = makeHass();
  const index = indexArea(hass, "lounge", [], resolveLabelFilter({ include: "on_card" }));
  assert.ok(!index.primary.includes("light.elsewhere"));
});

test("the main light is auto-detected only among filtered lights, and an explicit one bypasses the filter", () => {
  const hass = makeHass();
  const cfg = { type: "x", area: "lounge" };
  const index = indexArea(hass, "lounge", [], resolveLabelFilter({ include: "on_card" }));
  assert.equal(findMainLight(hass, cfg, index), "light.lounge_ceiling");
  assert.equal(findMainLight(hass, { ...cfg, main_light: "light.lounge_lamp" }, index), "light.lounge_lamp");
});

test("nothing matching leaves an empty index but remembers the area is not empty", () => {
  const hass = makeHass();
  const index = indexArea(hass, "lounge", [], resolveLabelFilter({ include: "missing" }));
  assert.equal(index.primary.length, 0);
  assert.equal(index.unfilteredCount, 203);
});
