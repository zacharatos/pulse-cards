import { test } from "node:test";
import assert from "node:assert/strict";

import {
  balanceRows,
  contentParts,
  cssColor,
  defaultIconTap,
  discoverActionEntity,
  entityAction,
  guessOptionIcon,
  isActive,
  isOff,
  optionAction,
  optionActive,
  optionLabel,
  optionsOf,
  resolveActions,
  stateColor,
  stateContentList,
  watchedEntities,
  withPending,
} from "../src/tile.ts";

const at = "2026-10-10T10:00:00Z";
function st(entity_id, state, attributes = {}) {
  return { entity_id, state, attributes, last_changed: at, last_updated: at };
}
function hassOf(list, reg = {}) {
  const states = {};
  const entities = {};
  for (const s of list) {
    states[s.entity_id] = s;
    entities[s.entity_id] = { entity_id: s.entity_id, ...(reg[s.entity_id] ?? {}) };
  }
  return { states, entities, language: "en", callService: async () => {} };
}

// ---- options ----

test("optionsOf reads each domain's own list", () => {
  assert.deepEqual(optionsOf(st("select.mode", "Auto", { options: ["Sleep", "Auto"] })), ["Sleep", "Auto"]);
  assert.deepEqual(optionsOf(st("fan.f", "on", { preset_modes: ["low", "high"] })), ["low", "high"]);
  assert.deepEqual(optionsOf(st("climate.c", "heat", { hvac_modes: ["off", "heat"] })), ["off", "heat"]);
  assert.deepEqual(optionsOf(st("humidifier.h", "on", { available_modes: ["eco"] })), ["eco"]);
  assert.deepEqual(optionsOf(st("media_player.tv", "on", { source_list: ["HDMI 1"] })), ["HDMI 1"]);
  assert.deepEqual(optionsOf(st("light.l", "on")), []);
  assert.deepEqual(optionsOf(undefined), []);
});

test("optionActive follows state or attribute per domain", () => {
  assert.equal(optionActive(st("select.mode", "Auto", { options: ["Auto"] }), "Auto"), true);
  assert.equal(optionActive(st("select.mode", "Auto", { options: ["Auto", "Sleep"] }), "Sleep"), false);
  assert.equal(optionActive(st("fan.f", "on", { preset_modes: ["low"], preset_mode: "low" }), "low"), true);
  assert.equal(optionActive(st("climate.c", "heat", { hvac_modes: ["heat"], preset_modes: ["eco"], preset_mode: "eco" }), "heat"), true);
  assert.equal(optionActive(st("climate.c", "heat", { hvac_modes: ["heat"], preset_modes: ["eco"], preset_mode: "eco" }), "eco"), true);
  assert.equal(optionActive(st("select.mode", "unavailable", { options: ["unavailable"] }), "unavailable"), false);
});

test("optionAction calls the right service for each domain", () => {
  assert.deepEqual(optionAction("select.mode", st("select.mode", "a", { options: ["a", "b"] }), "b"), {
    action: "perform-action",
    perform_action: "select.select_option",
    target: { entity_id: "select.mode" },
    data: { option: "b" },
  });
  assert.equal(optionAction("input_select.m", undefined, "x").perform_action, "input_select.select_option");
  assert.equal(optionAction("fan.f", st("fan.f", "on", { preset_modes: ["x"] }), "x").data.preset_mode, "x");
  const climate = st("climate.c", "heat", { hvac_modes: ["off", "heat"], preset_modes: ["eco"] });
  assert.equal(optionAction("climate.c", climate, "off").perform_action, "climate.set_hvac_mode");
  assert.deepEqual(optionAction("climate.c", climate, "eco").data, { preset_mode: "eco" });
  assert.equal(optionAction("humidifier.h", undefined, "eco").perform_action, "humidifier.set_mode");
  assert.equal(optionAction("media_player.tv", undefined, "HDMI 1").data.source, "HDMI 1");
});

test("optionLabel uses HA's formatting, else a tidy fallback", () => {
  const s = st("fan.f", "on", { preset_modes: ["fan_only"] });
  assert.equal(optionLabel(undefined, s, "fan_only"), "Fan only");
  const hass = { formatEntityAttributeValue: (_s, attr, v) => `${attr}:${v}`, formatEntityState: (_s, v) => `state:${v}` };
  assert.equal(optionLabel(hass, s, "fan_only"), "preset_mode:fan_only");
  assert.equal(optionLabel(hass, st("select.m", "a", { options: ["a"] }), "a"), "state:a");
});

test("guessOptionIcon knows common modes in English and Greek", () => {
  assert.equal(guessOptionIcon("Sleep"), "mdi:power-sleep");
  assert.equal(guessOptionIcon("Auto"), "mdi:fan-auto");
  assert.equal(guessOptionIcon("Manual"), "mdi:hand-back-right-outline");
  assert.equal(guessOptionIcon("Low"), "mdi:fan-speed-1");
  assert.equal(guessOptionIcon("High"), "mdi:fan-speed-3");
  assert.equal(guessOptionIcon("heat_cool"), "mdi:sun-snowflake-variant");
  assert.equal(guessOptionIcon("Ύπνος"), "mdi:power-sleep");
  assert.equal(guessOptionIcon("Αυτόματο"), "mdi:fan-auto");
  assert.equal(guessOptionIcon("Something"), "mdi:tune-variant");
});

// ---- discovery ----

const purifier = [
  st("switch.purifier", "on", { friendly_name: "Purifier" }),
  st("select.purifier_mode", "Auto", { options: ["Sleep", "Manual", "Auto"] }),
  st("sensor.purifier_pm25", "8"),
];
const purifierReg = {
  "switch.purifier": { device_id: "d1" },
  "select.purifier_mode": { device_id: "d1", entity_category: "config" },
  "sensor.purifier_pm25": { device_id: "d1" },
};

test("discovers the one select on the main entity's device", () => {
  const hass = hassOf(purifier, purifierReg);
  assert.equal(discoverActionEntity(hass, { type: "x", entity: "switch.purifier" }), "select.purifier_mode");
});

test("the main entity's own options come first", () => {
  const hass = hassOf([...purifier, st("fan.purifier", "on", { preset_modes: ["low", "high"] })], { ...purifierReg, "fan.purifier": { device_id: "d1" } });
  assert.equal(discoverActionEntity(hass, { type: "x", entity: "fan.purifier" }), "fan.purifier");
});

test("several selects: only a single 'mode' one is taken; hidden and diagnostic ones are ignored", () => {
  const list = [...purifier, st("select.purifier_brightness", "dim", { options: ["dim", "bright"] })];
  const reg = { ...purifierReg, "select.purifier_brightness": { device_id: "d1" } };
  assert.equal(discoverActionEntity(hassOf(list, reg), { type: "x", entity: "switch.purifier" }), "select.purifier_mode");
  const noMode = [purifier[0], st("select.a", "x", { options: ["x", "y"] }), st("select.b", "x", { options: ["x", "y"] })];
  assert.equal(
    discoverActionEntity(hassOf(noMode, { "switch.purifier": { device_id: "d1" }, "select.a": { device_id: "d1" }, "select.b": { device_id: "d1" } }), {
      type: "x",
      entity: "switch.purifier",
    }),
    undefined
  );
  const hidden = { ...purifierReg, "select.purifier_mode": { device_id: "d1", hidden: true } };
  assert.equal(discoverActionEntity(hassOf(purifier, hidden), { type: "x", entity: "switch.purifier" }), undefined);
});

test("too many options make no automatic row; explicit action_entity wins, `none` turns it off", () => {
  const many = st("select.purifier_mode", "1", { options: ["1", "2", "3", "4", "5", "6", "7"] });
  const hass = hassOf([purifier[0], many], purifierReg);
  assert.equal(discoverActionEntity(hass, { type: "x", entity: "switch.purifier" }), undefined);
  assert.equal(discoverActionEntity(hass, { type: "x", entity: "switch.purifier", action_entity: "select.other" }), "select.other");
  assert.equal(discoverActionEntity(hassOf(purifier, purifierReg), { type: "x", entity: "switch.purifier", action_entity: "none" }), undefined);
});

// ---- buttons ----

test("without `actions`: one lit-aware button per option", () => {
  const hass = hassOf(purifier, purifierReg);
  const acts = resolveActions(hass, { type: "x", entity: "switch.purifier" }, "select.purifier_mode");
  assert.deepEqual(acts.map((a) => [a.name, a.icon, a.active]), [
    ["Sleep", "mdi:power-sleep", false],
    ["Manual", "mdi:hand-back-right-outline", false],
    ["Auto", "mdi:fan-auto", true],
  ]);
  assert.equal(acts[0].tap_action.perform_action, "select.select_option");
  assert.deepEqual(acts[0].hold_action, { action: "more-info" });
});

test("explicit actions: options on the action entity, other entities, plain actions, empty list", () => {
  const list = [
    ...purifier,
    st("switch.ionizer", "on", { friendly_name: "Ionizer" }),
    st("scene.night", "2026-10-09T22:00:00Z", { friendly_name: "Night" }),
    st("select.other", "unavailable", { options: [] }),
  ];
  const hass = hassOf(list, purifierReg);
  const config = {
    type: "x",
    entity: "switch.purifier",
    actions: [
      { option: "Sleep", name: "Zzz", icon: "mdi:sleep" },
      { entity: "switch.ionizer" },
      { entity: "scene.night" },
      { name: "Filter", icon: "mdi:air-filter", tap_action: { action: "navigate", navigation_path: "/x" } },
      { entity: "select.other", option: "a" },
    ],
  };
  const acts = resolveActions(hass, config, "select.purifier_mode");
  assert.equal(acts[0].entity, "select.purifier_mode");
  assert.equal(acts[0].name, "Zzz");
  assert.equal(acts[0].active, false);
  assert.deepEqual(acts[1].tap_action, { action: "toggle" });
  assert.equal(acts[1].active, true);
  assert.equal(acts[1].name, "Ionizer");
  assert.equal(acts[2].tap_action.perform_action, "scene.turn_on");
  assert.equal(acts[2].active, false, "a scene is never 'on'");
  assert.equal(acts[3].tap_action.action, "navigate");
  assert.equal(acts[3].hold_action, undefined);
  assert.equal(acts[3].disabled, false);
  assert.equal(acts[4].disabled, true, "unavailable target");
  assert.deepEqual(resolveActions(hass, { ...config, actions: [] }, "select.purifier_mode"), []);
});

test("an option button without any action entity targets the main entity", () => {
  const hass = hassOf([st("fan.f", "on", { preset_modes: ["eco", "boost"], preset_mode: "eco" })]);
  const acts = resolveActions(hass, { type: "x", entity: "fan.f", actions: [{ option: "eco" }] }, undefined);
  assert.equal(acts[0].entity, "fan.f");
  assert.equal(acts[0].active, true);
});

test("withPending lights the tapped option at once", () => {
  const hass = hassOf(purifier, purifierReg);
  const acts = resolveActions(hass, { type: "x", entity: "switch.purifier" }, "select.purifier_mode");
  const next = withPending(acts, new Map([["select.purifier_mode", "Sleep"]]));
  assert.deepEqual(next.map((a) => a.active), [true, false, false]);
  assert.equal(withPending(acts, new Map()), acts);
});

test("entityAction and defaultIconTap stay safe", () => {
  assert.deepEqual(entityAction("light.x"), { action: "toggle" });
  assert.deepEqual(entityAction("lock.front"), { action: "more-info" });
  assert.deepEqual(entityAction("cover.garage"), { action: "more-info" });
  assert.equal(entityAction("script.coffee").perform_action, "script.turn_on");
  assert.equal(entityAction("button.restart").perform_action, "button.press");
  assert.deepEqual(defaultIconTap("switch.x"), { action: "toggle" });
  assert.deepEqual(defaultIconTap("sensor.x"), { action: "more-info" });
});

// ---- states, content, helpers ----

test("isActive and isOff", () => {
  assert.equal(isActive(st("switch.a", "on")), true);
  assert.equal(isActive(st("switch.a", "off")), false);
  assert.equal(isActive(st("climate.a", "heat")), true);
  assert.equal(isActive(st("sensor.a", "12")), false);
  assert.equal(isOff(st("sensor.a", "12")), false);
  assert.equal(isOff(st("switch.a", "unavailable")), true);
  assert.equal(isOff(st("media_player.a", "idle")), true);
  assert.equal(isOff(undefined), true);
});

test("contentParts: state, times, attributes, other entities", () => {
  const s = st("fan.f", "on", { percentage: 40, preset_mode: "auto" });
  const hass = hassOf([s, st("sensor.pm25", "8", { unit_of_measurement: "µg/m³" }), st("sensor.gone", "unavailable")]);
  assert.deepEqual(contentParts(hass, s, ["state", "last_changed"]), [
    { kind: "text", value: "On" },
    { kind: "time", value: at },
  ]);
  assert.deepEqual(contentParts(hass, s, ["percentage", "sensor.pm25", "sensor.gone", "nope"]), [
    { kind: "text", value: "40" },
    { kind: "text", value: "8 µg/m³" },
  ]);
  assert.deepEqual(contentParts(hass, st("fan.f", "unavailable"), ["state", "last_changed"]), [{ kind: "text", value: "Unavailable" }]);
});

test("stateContentList defaults and normalises", () => {
  assert.deepEqual(stateContentList({ type: "x", entity: "a.b" }), ["state", "last_changed"]);
  assert.deepEqual(stateContentList({ type: "x", entity: "a.b", state_content: "state" }), ["state"]);
  assert.deepEqual(stateContentList({ type: "x", entity: "a.b", state_content: [] }), []);
});

test("watchedEntities covers main, action entity, button entities and content entities", () => {
  const w = watchedEntities(
    { type: "x", entity: "switch.p", actions: [{ entity: "switch.i" }, { option: "a" }], state_content: ["state", "sensor.pm25"] },
    "select.m"
  );
  assert.deepEqual([...w].sort(), ["select.m", "sensor.pm25", "switch.i", "switch.p"]);
});

test("balanceRows, cssColor, stateColor", () => {
  assert.deepEqual(balanceRows(3, 4), [3]);
  assert.deepEqual(balanceRows(5, 4), [3, 2]);
  assert.deepEqual(balanceRows(6, 3), [3, 3]);
  assert.deepEqual(balanceRows(0, 4), []);
  assert.equal(cssColor("amber"), "var(--amber-color, amber)");
  assert.equal(cssColor("#fff"), "#fff");
  assert.equal(stateColor(st("fan.f", "on"), "teal"), "var(--teal-color, teal)");
  assert.match(stateColor(st("fan.f", "on")), /^var\(--state-fan-on-color, var\(--state-fan-active-color/);
});

// ---- numbers and further rows ----

test("a number with a handful of steps offers each step; a wide range offers none", async () => {
  const { numberSteps } = await import("../src/tile.ts");
  assert.deepEqual(numberSteps(st("number.level", "2", { min: 1, max: 3, step: 1 })), ["1", "2", "3"]);
  assert.deepEqual(numberSteps(st("input_number.x", "0", { min: 0, max: 1, step: 0.5 })), ["0", "0.5", "1"]);
  assert.equal(numberSteps(st("number.big", "20", { min: 0, max: 100, step: 1 })), undefined);
  assert.deepEqual(optionsOf(st("number.level", "2", { min: 1, max: 3, step: 1 })), ["1", "2", "3"]);
});

test("a number option is lit by value and set with number.set_value", () => {
  const s = st("number.level", "2.0", { min: 1, max: 3, step: 1 });
  assert.equal(optionActive(s, "2"), true);
  assert.equal(optionActive(s, "3"), false);
  assert.deepEqual(optionAction("number.level", s, "3"), {
    action: "perform-action",
    perform_action: "number.set_value",
    target: { entity_id: "number.level" },
    data: { value: 3 },
  });
});

test("button_rows add rows from their own entity, after the first, with their own columns", async () => {
  const { resolveRows } = await import("../src/tile.ts");
  const hass = hassOf([
    st("switch.purifier", "on"),
    st("select.purifier_mode", "Auto", { options: ["Auto", "Sleep", "Manual"] }),
    st("number.purifier_level", "1", { min: 1, max: 3, step: 1 }),
  ]);
  const config = {
    entity: "switch.purifier",
    action_entity: "select.purifier_mode",
    button_rows: [{ action_entity: "number.purifier_level", columns: 3 }, { actions: [{ option: "Sleep", name: "Night" }] }, {}],
  };
  const rows = resolveRows(hass, config, "select.purifier_mode");
  assert.equal(rows.length, 3); // the empty row is left out
  assert.deepEqual(rows[0].actions.map((a) => [a.option, a.active]), [["Auto", true], ["Sleep", false], ["Manual", false]]);
  assert.equal(rows[0].columns, 4);
  assert.deepEqual(rows[1].actions.map((a) => [a.option, a.active, a.entity]), [["1", true, "number.purifier_level"], ["2", false, "number.purifier_level"], ["3", false, "number.purifier_level"]]);
  assert.equal(rows[1].columns, 3);
  // A row without its own entity sets options on the first row's entity.
  assert.equal(rows[2].actions[0].entity, "select.purifier_mode");
  assert.equal(rows[2].actions[0].name, "Night");
  // Keys stay unique across rows, so a pending tap breathes on one button only.
  const keys = rows.flatMap((r) => r.actions.map((a) => a.key));
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(watchedEntities(config, "select.purifier_mode").has("number.purifier_level"));
});
