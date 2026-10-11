import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildRows,
  currentMode,
  discoverModeEntity,
  entityMatches,
  groupRows,
  matchesTargets,
  menuFor,
  modeLabelIds,
  normalize,
  recapture,
  selectScenes,
  stubEntities,
  targetLines,
  undoSnapshot,
  untouchedSince,
  watched,
  UNDO_ENTITY,
} from "../src/scenes.ts";

const T0 = Date.parse("2026-10-10T18:00:00Z");
const iso = (ms) => new Date(ms).toISOString();

function makeHass() {
  const states = {};
  const entities = {};
  const add = (entity_id, state, attributes = {}, reg = {}, changed = T0 - 3600_000) => {
    states[entity_id] = { entity_id, state, attributes, last_changed: iso(changed), last_updated: iso(changed) };
    entities[entity_id] = { entity_id, ...reg };
  };
  add("scene.living_evening", iso(T0), { friendly_name: "Living Evening", id: "1", entity_id: ["light.sofa", "cover.blind"] }, { area_id: "living", labels: ["evening"] });
  add("scene.living_movie", iso(T0 - 86400_000), { friendly_name: "Living Movie", id: "2", entity_id: ["light.sofa"] }, { area_id: "living", labels: ["movie_night"] });
  add("scene.bedroom_night", "unknown", { friendly_name: "Bedroom Night", entity_id: ["light.bed"] }, { area_id: "bedroom", labels: ["night"] });
  add("scene.hidden", "unknown", { friendly_name: "Hidden" }, { hidden: true });
  add("scene.broken", "unavailable", { friendly_name: "Broken" }, {});
  add(UNDO_ENTITY, iso(T0), { friendly_name: "scene_pulse_undo", entity_id: ["light.sofa"] }, {});
  add("light.sofa", "on", { brightness: 128, color_mode: "color_temp", color_temp_kelvin: 2700, friendly_name: "Sofa", supported_features: 4 }, {}, T0 + 2000);
  add("light.bed", "off", {}, {});
  add("cover.blind", "closing", { current_position: 2 }, {}, T0 + 5000);
  add("input_select.house_mode", "Movie night", { options: ["Day", "Movie night", "Night"] }, {});
  return { states, entities, areas: { living: { area_id: "living", name: "Living Room" }, bedroom: { area_id: "bedroom", name: "Bedroom" } } };
}

const src = (over = {}) => ({ configs: new Map(), modeLabels: new Set(), ...over });

test("zero config shows every visible scene by name, never our undo scene", () => {
  assert.deepEqual(selectScenes(makeHass(), {}), ["scene.bedroom_night", "scene.broken", "scene.living_evening", "scene.living_movie"]);
});

test("explicit first, then labels; exclude wins", () => {
  const hass = makeHass();
  assert.deepEqual(selectScenes(hass, { entities: ["scene.living_movie"], label: ["night", "evening"] }), [
    "scene.living_movie",
    "scene.bedroom_night",
    "scene.living_evening",
  ]);
  assert.deepEqual(selectScenes(hass, { label: "night", exclude: ["scene.bedroom_night"] }), []);
  assert.deepEqual(selectScenes(hass, { entities: ["scene.living_movie", "light.sofa"] }), ["scene.living_movie"]);
});

test("entity matching: state, tolerances, moving covers, off ignores attributes", () => {
  const s = (state, attributes = {}) => ({ entity_id: "x", state, attributes, last_changed: "", last_updated: "" });
  assert.ok(entityMatches("light.a", { state: "on", brightness: 130 }, s("on", { brightness: 127 })));
  assert.ok(!entityMatches("light.a", { state: "on", brightness: 200 }, s("on", { brightness: 127 })));
  assert.ok(entityMatches("light.a", { state: "off", brightness: null }, s("off")));
  assert.ok(!entityMatches("light.a", { state: "on" }, s("off")));
  assert.ok(entityMatches("cover.a", { state: "closed", current_position: 0 }, s("closing", { current_position: 2 })));
  assert.ok(entityMatches("light.a", { state: "on", color_mode: "hs", color_temp_kelvin: 6000 }, s("on", { color_temp_kelvin: 2700 })));
  assert.ok(!entityMatches("climate.a", { state: "heat", preset_mode: "eco" }, s("heat", { preset_mode: "comfort" })));
  assert.ok(!entityMatches("light.a", { state: "on" }, undefined));
  assert.ok(!entityMatches("light.a", { state: "on" }, s("unavailable")));
});

test("matchesTargets needs every entity, and at least one", () => {
  const hass = makeHass();
  assert.ok(matchesTargets(hass, { entities: { "light.sofa": { state: "on", brightness: 128 }, "cover.blind": { state: "closed" } } }));
  assert.ok(!matchesTargets(hass, { entities: { "light.sofa": { state: "on" }, "light.bed": { state: "on" } } }));
  assert.ok(!matchesTargets(hass, { entities: {} }));
});

test("untouched: nothing changed after the scene settled", () => {
  const hass = makeHass();
  assert.ok(untouchedSince(hass, hass.states["scene.living_evening"]));
  hass.states["light.sofa"].last_updated = iso(T0 + 60_000);
  assert.ok(!untouchedSince(hass, hass.states["scene.living_evening"]));
  assert.ok(!untouchedSince(hass, hass.states["scene.bedroom_night"]), "never ran");
});

test("rows: targets decide where stored, otherwise only the latest untouched scene is active", () => {
  const hass = makeHass();
  const ids = ["scene.living_evening", "scene.living_movie", "scene.bedroom_night", "scene.broken"];
  // No stored configs: Living Evening ran last and nothing changed since.
  let rows = buildRows(hass, {}, ids, src());
  assert.deepEqual(rows.map((r) => r.status), ["active", "idle", "idle", "unavailable"]);
  assert.equal(rows[0].activeBy, "untouched");
  assert.equal(rows[2].last, undefined);
  // Stored configs: Living Movie matches the house now even though it ran yesterday; Evening doesn't.
  const configs = new Map([
    ["1", { entities: { "light.sofa": { state: "on", brightness: 255 } } }],
    ["2", { entities: { "light.sofa": { state: "on", brightness: 128 } } }],
  ]);
  rows = buildRows(hass, { confirm: ["scene.living_movie"] }, ids, src({ configs }));
  assert.deepEqual(rows.map((r) => r.status), ["idle", "active", "idle", "unavailable"]);
  assert.equal(rows[1].activeBy, "targets");
  assert.equal(rows[1].confirm, true);
});

test("house mode: discovery, label matching by name or id, accents and spaces ignored", () => {
  const hass = makeHass();
  assert.equal(discoverModeEntity(hass, {}), "input_select.house_mode");
  assert.equal(discoverModeEntity(hass, { mode_entity: "none" }), undefined);
  assert.equal(currentMode(hass, "input_select.house_mode"), "Movie night");
  assert.equal(normalize("Νύχτα"), normalize("νυχτα"));
  const labels = modeLabelIds("Movie night", { movie_night: "Movie Night", cinema: "Cinema" });
  assert.ok(labels.has("movie_night"));
  assert.ok(!labels.has("cinema"));
  const rows = buildRows(hass, {}, ["scene.living_evening", "scene.living_movie"], src({ modeLabels: modeLabelIds("Movie night", {}) }));
  assert.deepEqual(rows.map((r) => r.forMode), [false, true]);
  const greek = modeLabelIds("Νύχτα", { l1: "νυχτα" });
  assert.ok(greek.has("l1"));
});

test("groups: mode section first, then areas; one untitled list gets a title under the mode section", () => {
  const hass = makeHass();
  const ids = ["scene.living_evening", "scene.living_movie", "scene.bedroom_night"];
  const rows = buildRows(hass, {}, ids, src({ modeLabels: new Set(["movie_night"]) }));
  const g = (by, modeTitle) => groupRows(hass, {}, rows, by, { other: "Other", rest: "More scenes", modeTitle }, new Set(["movie_night"]));
  assert.deepEqual(g("area", "For Movie night").map((x) => [x.title, x.rows.map((r) => r.entity_id)]), [
    ["For Movie night", ["scene.living_movie"]],
    ["Bedroom", ["scene.bedroom_night"]],
    ["Living Room", ["scene.living_evening"]],
  ]);
  assert.deepEqual(g("none", "For Movie night").map((x) => x.title), ["For Movie night", "More scenes"]);
  assert.deepEqual(g("none", undefined).map((x) => x.title), [""]);
  // Grouping by label skips the mode's own label.
  assert.deepEqual(g("label", undefined).map((x) => x.title), ["evening", "night", "Other"]);
});

test("menu entries depend on admin, stored config and undo", () => {
  const row = { status: "idle", id: "1", members: ["light.sofa"] };
  assert.deepEqual(menuFor(row, { admin: true, canUndo: true, hasConfig: true }), ["run", "undo", "show", "update", "edit", "more_info"]);
  assert.deepEqual(menuFor(row, { admin: false, canUndo: false, hasConfig: false }), ["run", "show", "more_info"]);
  assert.deepEqual(menuFor({ status: "unavailable", members: [] }, { admin: true, canUndo: false, hasConfig: false }), ["more_info"]);
});

test("undo snapshot covers the scene's own entities, never other scenes", () => {
  assert.deepEqual(undoSnapshot(["light.sofa", "scene.other", "cover.blind"]), { scene_id: "scene_pulse_undo", snapshot_entities: ["light.sofa", "cover.blind"] });
  assert.equal(undoSnapshot([]), undefined);
});

test("recapture keeps the config and writes current states without descriptive attributes", () => {
  const hass = makeHass();
  hass.states["light.gone"] = undefined;
  const out = recapture(hass, { id: "1", name: "Living Evening", icon: "mdi:sofa", metadata: { x: 1 }, entities: { "light.sofa": { state: "off" }, "light.gone": { state: "on" } } });
  assert.equal(out.name, "Living Evening");
  assert.deepEqual(out.metadata, { x: 1 });
  assert.deepEqual(out.entities["light.sofa"], { brightness: 128, color_mode: "color_temp", color_temp_kelvin: 2700, state: "on" });
  assert.deepEqual(out.entities["light.gone"], { state: "on" });
});

test("target lines: percentages and whether each entity already matches", () => {
  const hass = makeHass();
  const lines = targetLines(hass, [], { entities: { "light.sofa": { state: "on", brightness: 128 }, "light.bed": { state: "on", brightness: 255 } } });
  assert.deepEqual(lines, [
    { entity_id: "light.sofa", state: "on", extra: "50%", matches: true },
    { entity_id: "light.bed", state: "on", extra: "100%", matches: false },
  ]);
  assert.deepEqual(targetLines(hass, ["light.bed"]), [{ entity_id: "light.bed" }]);
});

test("watched includes members, stored targets and the mode entity; stub picks recent scenes", () => {
  const hass = makeHass();
  const w = watched(hass, ["scene.living_evening"], new Map([["1", { entities: { "light.extra": {} } }]]), "input_select.house_mode");
  assert.deepEqual([...w].sort(), ["cover.blind", "input_select.house_mode", "light.extra", "light.sofa", "scene.living_evening"]);
  assert.deepEqual(stubEntities(hass, 2), ["scene.living_evening", "scene.living_movie"]);
});
