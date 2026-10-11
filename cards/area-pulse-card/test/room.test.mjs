import test from "node:test";
import assert from "node:assert/strict";

import { indexArea } from "../src/discovery.ts";
import { resolveLabelFilter } from "../src/labels.ts";
import { buildRoom, matchesQuery, roomLabels, tileConfig } from "../src/room.ts";

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
  const add = (id, s, attrs = {}, extra = {}) => {
    states[id] = state(id, s, attrs);
    entities[id] = { entity_id: id, area_id: "lounge", ...extra };
  };
  add("sensor.hum", "31.8", { friendly_name: "Sonoff Temperature(LR) Humidity", device_class: "humidity", unit_of_measurement: "%" }, { device_id: "d_sonoff" });
  add("sensor.temp", "24.4", { friendly_name: "Sonoff Temperature(LR) Temperature", device_class: "temperature", unit_of_measurement: "°C" }, { device_id: "d_sonoff" });
  add("sensor.lux_a", "133", { friendly_name: "Moes Presence(LR) Illuminance", device_class: "illuminance" }, { device_id: "d_moes" });
  add("sensor.lux_b", "8", { friendly_name: "Aqara Motion(LR) Illuminance", device_class: "illuminance" }, { device_id: "d_aqara" });
  add("sensor.mode", "eco", { friendly_name: "Lounge Mode" });
  add("light.tv", "on", { friendly_name: "Lounge TV" });
  add("light.ceiling", "off", { friendly_name: "Lounge Ceiling" });
  add("light.strip", "on", { friendly_name: "Lounge Strip" });
  add("switch.purifier", "on", { friendly_name: "Air Purifier Status" });
  add("media_player.lounge", "paused", { friendly_name: "Lounge" });
  add("binary_sensor.door", "on", { friendly_name: "Catch Door", device_class: "door" });
  add("binary_sensor.motion", "off", { friendly_name: "Aqara Motion Occupancy", device_class: "occupancy" });
  add("binary_sensor.dry", "off", { friendly_name: "Balcony Dry", device_class: "moisture" });
  add("binary_sensor.leak", "on", { friendly_name: "Sink Leak", device_class: "moisture" });
  add("light.dead", "unavailable", { friendly_name: "Lounge Dead Bulb" });
  add("update.fw", "off", { friendly_name: "Firmware" });
  add("scene.movie", "unknown", { friendly_name: "Movie" });
  add("sensor.door_battery", "9", { friendly_name: "Door Battery", device_class: "battery", unit_of_measurement: "%" }, { entity_category: "diagnostic" });
  add("sensor.motion_battery", "80", { friendly_name: "Motion Battery", device_class: "battery", unit_of_measurement: "%" }, { entity_category: "diagnostic" });
  for (let i = 0; i < 200; i++) add(`sensor.noise_${i}`, "1", { friendly_name: `Noise ${i}`, device_class: "power" });
  const devices = {
    d_sonoff: { id: "d_sonoff", name: "Sonoff Temperature(LR)" },
    d_moes: { id: "d_moes", name: "Moes Presence(LR)" },
    d_aqara: { id: "d_aqara", name: "Aqara Motion(LR)" },
  };
  return { states, entities, devices, areas: { lounge: { area_id: "lounge", name: "Lounge" } }, language: "en" };
}

const build = (filterCfg) => {
  const hass = makeHass();
  const index = indexArea(hass, "lounge", [], resolveLabelFilter(filterCfg));
  return { hass, room: buildRoom(hass, {}, index) };
};
const ids = (room, id) => room.sections.find((s) => s.id === id)?.entities ?? [];

test("sections come in the order of usefulness: attention, controls, status, sensors last", () => {
  const { room } = build();
  const order = room.sections.map((s) => s.id);
  assert.deepEqual(order, ["attention", "lights", "media", "switches", "other", "status", "sensors"]);
});

test("attention holds tripped alerts, low batteries and unavailable entities, and nothing twice", () => {
  const { room } = build();
  const attention = room.sections[0];
  assert.deepEqual(attention.entities, ["binary_sensor.leak", "sensor.door_battery", "light.dead"]);
  assert.equal(attention.reasons["binary_sensor.leak"], "alert");
  assert.equal(attention.reasons["sensor.door_battery"], "battery");
  assert.equal(attention.reasons["light.dead"], "unavailable");
  const seen = room.sections.flatMap((s) => s.entities);
  assert.equal(new Set(seen).size, seen.length);
  assert.ok(!ids(room, "lights").includes("light.dead"));
  assert.ok(!ids(room, "status").includes("binary_sensor.leak"));
  assert.ok(!seen.includes("sensor.motion_battery"), "healthy batteries are not listed");
});

test("an unavailable media player is not a problem: it stays in Media, other domains still need attention", () => {
  const hass = makeHass();
  hass.states["media_player.tv_off"] = state("media_player.tv_off", "unavailable", { friendly_name: "Lounge TV Box" });
  hass.entities["media_player.tv_off"] = { entity_id: "media_player.tv_off", area_id: "lounge" };
  const room = buildRoom(hass, {}, indexArea(hass, "lounge", [], resolveLabelFilter()));
  assert.ok(!ids(room, "attention").includes("media_player.tv_off"));
  assert.equal(room.sections[0].reasons["media_player.tv_off"], undefined);
  assert.deepEqual(ids(room, "media"), ["media_player.lounge", "media_player.tv_off"]);
  assert.ok(ids(room, "attention").includes("light.dead"), "an unavailable light still needs attention");
});

test("controls show active things first, and noisy domains are skipped", () => {
  const { room } = build();
  assert.deepEqual(ids(room, "lights"), ["light.strip", "light.tv", "light.ceiling"]);
  assert.ok(!room.sections.flatMap((s) => s.entities).includes("update.fw"));
  assert.deepEqual(ids(room, "other"), ["scene.movie"]);
});

test("status rows put presence and what is open before the rest", () => {
  const { room } = build();
  assert.deepEqual(ids(room, "status"), ["binary_sensor.door", "binary_sensor.motion", "binary_sensor.dry"]);
});

test("sensors are ordered by usefulness, text sensors last", () => {
  const { room } = build();
  const sensors = ids(room, "sensors");
  assert.deepEqual(sensors.slice(0, 5), ["sensor.temp", "sensor.hum", "sensor.lux_b", "sensor.lux_a", "sensor.noise_0"]);
  assert.equal(sensors.at(-1), "sensor.mode");
});

test("the label filter shrinks the sheet the same way it shrinks the card", () => {
  const hass = makeHass();
  hass.entities["light.tv"].labels = ["on_card"];
  hass.entities["sensor.temp"].labels = ["on_card"];
  const index = indexArea(hass, "lounge", [], resolveLabelFilter({ include: "on_card" }));
  const room = buildRoom(hass, {}, index);
  assert.deepEqual(room.sections.map((s) => s.id), ["lights", "sensors"]);
  assert.equal(room.total, 2);
});

test("short names drop the area, and the device for sensors", () => {
  const { hass, room } = build();
  const labels = roomLabels(hass, "lounge", ids(room, "sensors"), ids(room, "lights"));
  assert.equal(labels["light.tv"].name, "TV");
  assert.equal(labels["sensor.temp"].name, "Temperature");
  assert.equal(labels["sensor.hum"].name, "Humidity");
  assert.equal(labels["sensor.mode"].name, "Mode");
});

test("identical short names get the device name back as a second line", () => {
  const { hass, room } = build();
  const labels = roomLabels(hass, "lounge", ids(room, "sensors"), []);
  assert.deepEqual(labels["sensor.lux_a"], { name: "Illuminance", sub: "Moes Presence(LR)" });
  assert.deepEqual(labels["sensor.lux_b"], { name: "Illuminance", sub: "Aqara Motion(LR)" });
});

test("a name that is only the area or only the device is left alone", () => {
  const { hass } = build();
  const labels = roomLabels(hass, "lounge", [], ["media_player.lounge"]);
  assert.equal(labels["media_player.lounge"].name, "Lounge");
});

test("search matches words in any order against name and entity id", () => {
  assert.ok(matchesQuery("", "anything"));
  assert.ok(matchesQuery("ceil light", "Lounge Ceiling", "light.ceiling"));
  assert.ok(matchesQuery("tv", "Lounge TV", "light.tv"));
  assert.ok(!matchesQuery("kitchen", "Lounge TV", "light.tv"));
});

test("a light's brightness slider is only there while the light is on", () => {
  const dim = { supported_color_modes: ["brightness"] };
  assert.deepEqual(tileConfig("light.a", state("light.a", "on", dim), "A").features, [{ type: "light-brightness" }]);
  assert.equal(tileConfig("light.a", state("light.a", "off", dim), "A").features, undefined);
  assert.equal(tileConfig("light.a", state("light.a", "unavailable", dim), "A").features, undefined);
  assert.equal(tileConfig("light.b", state("light.b", "on", { supported_color_modes: ["onoff"] }), "B").features, undefined);
  // Other controls keep their feature whatever the state.
  assert.deepEqual(tileConfig("cover.c", state("cover.c", "closed"), "C").features, [{ type: "cover-open-close" }]);
});

test("scenes, scripts and buttons run on tap and never say Unknown", () => {
  const never = tileConfig("scene.s", state("scene.s", "unknown"), "S");
  assert.equal(never.hide_state, true);
  assert.deepEqual(never.tap_action, { action: "perform-action", perform_action: "scene.turn_on", target: { entity_id: "scene.s" } });
  assert.deepEqual(never.icon_tap_action, never.tap_action);
  assert.deepEqual(never.hold_action, { action: "more-info" });
  // A scene that ran keeps HA's own state line: the relative time it last ran.
  const ran = tileConfig("scene.s", state("scene.s", "2026-10-01T20:00:00+00:00"), "S");
  assert.equal(ran.hide_state, undefined);
  assert.equal(ran.state_content, undefined);
  // Scripts are on/off; when they last ran is an attribute.
  assert.equal(tileConfig("script.x", state("script.x", "off", { last_triggered: "2026-10-01T20:00:00+00:00" }), "X").state_content, "last_triggered");
  assert.equal(tileConfig("script.x", state("script.x", "off", { last_triggered: null }), "X").hide_state, true);
  assert.equal(tileConfig("script.x", state("script.x", "on"), "X").hide_state, undefined, "a running script says so");
  assert.equal(tileConfig("button.b", state("button.b", "unknown"), "B").tap_action.perform_action, "button.press");
});
