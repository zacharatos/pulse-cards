import { test } from "node:test";
import assert from "node:assert/strict";

import {
  alarmView,
  areaName,
  badgeTone,
  balanceRows,
  byArea,
  discoverOne,
  discoverPersons,
  firstName,
  greetingKey,
  isNight,
  indexHome,
  NUDGE_GROUPS,
  nudges,
  pulseGroups,
  pulseTone,
  resolveNavigationPath,
  shortcutBadge,
  shortcutTapAction,
  watchedEntities,
} from "../src/home.ts";

// An invented home. No real entity ids.
function fixture() {
  const states = {};
  const entities = {};
  const add = (entity_id, state, attributes = {}, reg = {}) => {
    states[entity_id] = { entity_id, state, attributes, last_changed: "", last_updated: "" };
    if (reg !== null) entities[entity_id] = { entity_id, ...reg };
  };
  add("person.alex", "home", { friendly_name: "Alex" });
  add("person.sam", "not_home", { friendly_name: "Sam" });
  add("person.guest", "home", { friendly_name: "Guest" }, { hidden: true });
  add("weather.home", "sunny", { friendly_name: "Home", temperature: 24.4 });
  add("weather.backup", "rainy", { friendly_name: "Zzz backup" });
  add("alarm_control_panel.house", "disarmed", { friendly_name: "House", code_format: null, supported_features: 3 });
  add("light.kitchen", "on", { friendly_name: "Kitchen" }, { area_id: "kitchen" });
  add("light.desk", "on", { friendly_name: "Desk" }, { device_id: "dev_desk" });
  add("light.hall", "off", { friendly_name: "Hall" });
  add("light.downstairs", "on", { friendly_name: "Downstairs", entity_id: ["light.kitchen", "light.hall"] });
  add("light.hidden", "on", { friendly_name: "Hidden" }, { hidden: true });
  add("binary_sensor.kitchen_window", "on", { device_class: "window" }, { area_id: "kitchen" });
  add("binary_sensor.front_door", "off", { device_class: "door" });
  add("binary_sensor.leak", "off", { device_class: "moisture" });
  add("binary_sensor.motion", "on", { device_class: "motion" });
  add("sensor.remote_battery", "12", { device_class: "battery", unit_of_measurement: "%" }, { entity_category: "diagnostic" });
  add("sensor.door_battery", "88", { device_class: "battery", unit_of_measurement: "%" }, { entity_category: "diagnostic" });
  add("media_player.tv", "playing", { friendly_name: "TV" });
  add("climate.ac", "cool", { hvac_action: "idle" });
  add("lock.front", "locked", {});
  add("sensor.power", "1520", { unit_of_measurement: "W" });
  add("light.yaml_only", "off", { friendly_name: "YAML light" }, null);
  return {
    states,
    entities,
    devices: { dev_desk: { id: "dev_desk", area_id: "office" } },
    areas: { kitchen: { area_id: "kitchen", name: "Kitchen" }, office: { area_id: "office", name: "Office" } },
    language: "en",
    user: { name: "alex demo" },
    callService: async () => undefined,
  };
}

test("greeting follows the time of day", () => {
  assert.equal(greetingKey(6), "greet_morning");
  assert.equal(greetingKey(12), "greet_afternoon");
  assert.equal(greetingKey(19), "greet_evening");
  assert.equal(greetingKey(23), "greet_night");
  assert.equal(greetingKey(3), "greet_night");
});

test("first name is the first word, capitalised", () => {
  assert.equal(firstName("alex demo"), "Alex");
  assert.equal(firstName("  Sam "), "Sam");
  assert.equal(firstName(undefined), "");
});

test("persons: all visible people by name, or the configured list", () => {
  const hass = fixture();
  assert.deepEqual(discoverPersons(hass, {}), ["person.alex", "person.sam"]);
  assert.deepEqual(discoverPersons(hass, { persons: ["person.sam", "person.missing"] }), ["person.sam"]);
});

test("one entity per domain: explicit wins, none hides, else first by name", () => {
  const hass = fixture();
  assert.equal(discoverOne(hass, "weather"), "weather.home");
  assert.equal(discoverOne(hass, "weather", "weather.backup"), "weather.backup");
  assert.equal(discoverOne(hass, "weather", "none"), undefined);
  assert.equal(discoverOne(hass, "alarm_control_panel"), "alarm_control_panel.house");
});

test("index skips hidden entities and light groups, keeps diagnostic batteries", () => {
  const hass = fixture();
  const idx = indexHome(hass, {});
  assert.deepEqual(idx.lights, ["light.desk", "light.hall", "light.kitchen", "light.yaml_only"]);
  assert.deepEqual(idx.windows, ["binary_sensor.kitchen_window"]);
  assert.deepEqual(idx.doors, ["binary_sensor.front_door"]);
  assert.deepEqual(idx.alerts, ["binary_sensor.leak"]);
  assert.equal(idx.batteries.length, 2);
  assert.ok(!Object.values(idx).flat().includes("binary_sensor.motion"));
});

test("exclude_entities and alert_classes are respected", () => {
  const hass = fixture();
  const idx = indexHome(hass, { exclude_entities: ["light.desk"], alert_classes: ["smoke"] });
  assert.ok(!idx.lights.includes("light.desk"));
  assert.deepEqual(idx.alerts, []);
});

test("pulse groups count what is active and drop empty groups", () => {
  const hass = fixture();
  const groups = pulseGroups(hass, {}, indexHome(hass, {}));
  const g = Object.fromEntries(groups.map((x) => [x.id, x.active]));
  assert.deepEqual(g.lights, ["light.desk", "light.kitchen"]);
  assert.deepEqual(g.windows, ["binary_sensor.kitchen_window"]);
  assert.deepEqual(g.batteries, ["sensor.remote_battery"]);
  assert.deepEqual(g.climate, []); // idle hvac_action is not active
  assert.deepEqual(g.media, ["media_player.tv"]);
  assert.ok(!("covers" in g)); // no covers in the home
  assert.deepEqual(groups.map((x) => x.id).slice(0, 2), ["alerts", "lights"]);
});

test("pulse order follows the config", () => {
  const hass = fixture();
  const groups = pulseGroups(hass, { pulse: ["windows", "lights"] }, indexHome(hass, {}));
  assert.deepEqual(groups.map((x) => x.id), ["windows", "lights"]);
});

test("areas come from the entity or its device", () => {
  const hass = fixture();
  assert.equal(areaName(hass, "light.kitchen"), "Kitchen");
  assert.equal(areaName(hass, "light.desk"), "Office");
  assert.equal(areaName(hass, "light.hall"), undefined);
  assert.deepEqual(
    byArea(hass, ["light.hall", "light.desk", "light.kitchen"]).map((s) => s.area),
    ["Kitchen", "Office", undefined]
  );
});

test("alarm: arm buttons filtered by support, disarm when armed, code opens the keypad", () => {
  const s = { entity_id: "alarm_control_panel.x", state: "disarmed", attributes: { supported_features: 1 } };
  assert.deepEqual(alarmView(s).buttons.map((b) => b.mode), ["arm_home"]);
  const armed = { ...s, state: "armed_away", attributes: { code_format: "number" } };
  const v = alarmView(armed);
  assert.equal(v.tone, "armed");
  assert.deepEqual(v.buttons, [{ mode: "disarm", service: "alarm_control_panel.alarm_disarm", needsCode: true }]);
  const noArmCode = { ...s, attributes: { code_format: "number", code_arm_required: false } };
  assert.equal(alarmView(noArmCode, ["arm_away"]).buttons[0].needsCode, false);
  assert.equal(alarmView({ ...s, state: "pending" }).tone, "pending");
  assert.equal(alarmView({ ...s, state: "triggered" }).tone, "triggered");
});

test("nudges only when everyone tracked is away", () => {
  const hass = fixture();
  const idx = indexHome(hass, {});
  const groups = pulseGroups(hass, { pulse: NUDGE_GROUPS }, idx);
  assert.deepEqual(nudges(hass, ["person.alex", "person.sam"], groups, "alarm_control_panel.house"), []);
  hass.states["person.alex"] = { ...hass.states["person.alex"], state: "Work" };
  const n = nudges(hass, ["person.alex", "person.sam"], groups, "alarm_control_panel.house");
  assert.deepEqual(n.map((x) => x.id), ["away_windows", "away_lights", "away_media", "away_alarm"]);
  // An open window can't be fixed from afar: it shows which one instead of running an action.
  assert.equal(n[0].popup, "windows");
  assert.equal(n[0].action, undefined);
  assert.deepEqual(n[0].entities, ["binary_sensor.kitchen_window"]);
  assert.equal(n[1].n, 2);
  assert.deepEqual(n[1].action.target, { entity_id: ["light.desk", "light.kitchen"] });
  assert.equal(n[3].action.perform_action, "alarm_control_panel.alarm_arm_away");
  assert.deepEqual(nudges(hass, [], groups), []); // nobody tracked: can't tell
});

test("nudges lock only the unlocked locks, safety first", () => {
  const hass = fixture();
  hass.states["person.alex"] = { ...hass.states["person.alex"], state: "not_home" };
  hass.states["lock.front"] = { ...hass.states["lock.front"], state: "unlocked" };
  hass.states["binary_sensor.front_door"] = { ...hass.states["binary_sensor.front_door"], state: "on" };
  const idx = indexHome(hass, {});
  const n = nudges(hass, ["person.alex", "person.sam"], pulseGroups(hass, { pulse: NUDGE_GROUPS }, idx));
  assert.deepEqual(n.map((x) => x.id), ["away_doors", "away_windows", "away_locks", "away_lights", "away_media"]);
  const locks = n.find((x) => x.id === "away_locks");
  assert.deepEqual(locks.action, { action: "perform-action", perform_action: "lock.lock", target: { entity_id: ["lock.front"] } });
});

test("tones: colour only for problems, openings and lights", () => {
  assert.equal(pulseTone("alerts"), "bad");
  assert.equal(pulseTone("batteries"), "bad");
  assert.equal(pulseTone("locks"), "bad");
  assert.equal(pulseTone("windows"), "warn");
  assert.equal(pulseTone("doors"), "warn");
  assert.equal(pulseTone("lights"), "on");
  for (const id of ["media", "covers", "fans", "switches", "climate"]) assert.equal(pulseTone(id), "", id);
  assert.equal(badgeTone({ badge: "lights" }), "on");
  assert.equal(badgeTone({ badge: "media" }), "");
  assert.equal(badgeTone({ badge: "sensor.todo_open" }), "");
  assert.equal(badgeTone({}), "");
});

test("shortcut rows are balanced, fuller rows first", () => {
  assert.deepEqual(balanceRows(7, 4), [4, 3]);
  assert.deepEqual(balanceRows(5, 4), [3, 2]);
  assert.deepEqual(balanceRows(8, 4), [4, 4]);
  assert.deepEqual(balanceRows(9, 4), [3, 3, 3]);
  assert.deepEqual(balanceRows(3, 4), [3]);
  assert.deepEqual(balanceRows(0, 4), []);
  assert.deepEqual(balanceRows(4, 0), [1, 1, 1, 1]);
});

test("relative navigation paths stay on the current dashboard", () => {
  assert.equal(resolveNavigationPath("lights", "/dashboard-home/0"), "/dashboard-home/lights");
  assert.equal(resolveNavigationPath("lights", "/"), "/lovelace/lights");
  assert.equal(resolveNavigationPath("/lovelace/lights", "/x/y"), "/lovelace/lights");
  assert.equal(resolveNavigationPath("#popup", "/x/y"), "#popup");
});

test("shortcut tap: explicit action > navigation_path > entity more-info", () => {
  assert.deepEqual(shortcutTapAction({ navigation_path: "lights" }, "/home/0"), {
    action: "navigate",
    navigation_path: "/home/lights",
  });
  assert.deepEqual(shortcutTapAction({ navigation_path: "x", tap_action: { action: "none" } }, "/"), { action: "none" });
  assert.deepEqual(shortcutTapAction({ entity: "lock.front" }, "/"), { action: "more-info", entity: "lock.front" });
  assert.equal(shortcutTapAction({}, "/"), undefined);
});

test("shortcut badges: pulse counts and entity states", () => {
  const hass = fixture();
  const idx = indexHome(hass, {});
  assert.equal(shortcutBadge(hass, { badge: "lights" }, idx), "2");
  assert.equal(shortcutBadge(hass, { badge: "covers" }, idx), undefined);
  assert.equal(shortcutBadge(hass, { badge: "sensor.remote_battery" }, idx), "12%");
  assert.equal(shortcutBadge(hass, { badge: "sensor.power" }, idx), "1520");
  assert.equal(shortcutBadge(hass, {}, idx), undefined);
});

test("watched entities cover people, extras, chips, shortcuts and pulse groups", () => {
  const hass = fixture();
  const idx = indexHome(hass, {});
  const w = watchedEntities(
    { sections: ["status", "nudges", "pulse", "shortcuts"], pulse: ["windows"], chips: [{ entity: "sensor.power" }], shortcuts: [{ entity: "lock.front", badge: "batteries" }] },
    idx,
    ["person.alex"],
    ["weather.home", undefined]
  );
  for (const id of ["person.alex", "weather.home", "sensor.power", "lock.front", "binary_sensor.kitchen_window", "light.kitchen", "media_player.tv", "sensor.remote_battery"])
    assert.ok(w.has(id), id);
  assert.ok(!w.has("climate.ac")); // nothing on the card shows climate
});

test("default blocks only watch what they show", () => {
  const hass = fixture();
  const idx = indexHome(hass, {});
  const w = watchedEntities({}, idx, ["person.alex"], []);
  assert.ok(w.has("binary_sensor.leak")); // alerts block
  assert.ok(w.has("light.kitchen")); // nudges watch lights
  assert.ok(w.has("media_player.tv")); // ... media
  assert.ok(w.has("binary_sensor.kitchen_window")); // ... and openings and locks
  assert.ok(w.has("lock.front"));
  assert.ok(!w.has("climate.ac"));
  assert.ok(!w.has("binary_sensor.motion"));
  const withBadge = watchedEntities({ shortcuts: [{ badge: "lights" }] }, idx, [], []);
  assert.ok(withBadge.has("light.kitchen"));
});

test("night follows the sun entity, else the clock", () => {
  const sun = (state) => ({ entity_id: "sun.sun", state, attributes: {}, last_changed: "", last_updated: "" });
  assert.equal(isNight(sun("below_horizon"), 13), true);
  assert.equal(isNight(sun("above_horizon"), 23), false);
  assert.equal(isNight(undefined, 22), true);
  assert.equal(isNight(undefined, 6), true);
  assert.equal(isNight(undefined, 12), false);
});

test("nudges off: lights are not watched without a pulse block", () => {
  const hass = fixture();
  const w = watchedEntities({ nudges: false }, indexHome(hass, {}), [], []);
  assert.ok(!w.has("light.kitchen"));
  assert.ok(!w.has("binary_sensor.kitchen_window"));
});
