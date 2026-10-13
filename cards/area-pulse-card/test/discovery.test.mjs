import test from "node:test";
import assert from "node:assert/strict";

import {
  AIR_QUALITY_CLASSES,
  SENSOR_CLASS_OPTIONS,
  buildGroups,
  entityReadings,
  findMainLight,
  glowAlpha,
  indexArea,
  lightColor,
  reading,
  readingSeverity,
  watchedEntities,
} from "../src/discovery.ts";
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

// ---- Air quality (issue #1) ----------------------------------------------------

test("the editor offers every air-quality device class Home Assistant has, and keeps the old ones", () => {
  for (const c of ["aqi", "pm1", "pm25", "pm10", "carbon_dioxide", "carbon_monoxide", "nitrogen_dioxide", "ozone",
    "volatile_organic_compounds", "volatile_organic_compounds_parts"]) assert.ok(AIR_QUALITY_CLASSES.includes(c), c);
  for (const c of ["illuminance", "pressure", "power", "energy", "sound_pressure", ...AIR_QUALITY_CLASSES])
    assert.ok(SENSOR_CLASS_OPTIONS.includes(c), c);
  assert.equal(new Set(SENSOR_CLASS_OPTIONS).size, SENSOR_CLASS_OPTIONS.length);
});

test("AQI and PM10 get warn and bad levels; CO2 and PM2.5 keep theirs", () => {
  const r = (deviceClass, value) => readingSeverity({ deviceClass, value });
  assert.equal(r("aqi", 42), "");
  assert.equal(r("aqi", 100), "");
  assert.equal(r("aqi", 101), "warn");
  assert.equal(r("aqi", 151), "bad");
  assert.equal(r("pm10", 30), "");
  assert.equal(r("pm10", 55), "warn");
  assert.equal(r("pm10", 160), "bad");
  assert.equal(r("pm25", 12), "warn");
  assert.equal(r("carbon_dioxide", 1500), "bad");
  assert.equal(r("pm1", 500), "");
  assert.equal(r("", 500), "");
});

function airHass() {
  const states = {};
  const entities = {};
  const add = (id, s, attrs = {}) => {
    states[id] = state(id, s, attrs);
    entities[id] = { entity_id: id, area_id: "office" };
  };
  // A purifier-like AQI sensor and a monitor with PM, VOC parts and a radon level without a device class.
  add("sensor.office_purifier_aqi", "64", { device_class: "aqi" });
  add("sensor.office_monitor_pm1", "4", { device_class: "pm1", unit_of_measurement: "µg/m³" });
  add("sensor.office_monitor_pm10", "61", { device_class: "pm10", unit_of_measurement: "µg/m³" });
  add("sensor.office_monitor_voc", "180", { device_class: "volatile_organic_compounds_parts", unit_of_measurement: "ppb" });
  add("sensor.office_monitor_radon", "38", { unit_of_measurement: "Bq/m³", icon: "mdi:radioactive" });
  add("sensor.office_monitor_status", "good", {});
  add("sensor.office_monitor_dead", "unavailable", { unit_of_measurement: "Bq/m³" });
  return { states, entities, devices: {}, areas: {}, language: "en" };
}

test("any air-quality class typed in sensor_classes is read like the others", () => {
  const hass = airHass();
  const index = indexArea(hass, "office");
  assert.deepEqual(reading(hass, index, "aqi"), { deviceClass: "aqi", value: 64, unit: "", entities: ["sensor.office_purifier_aqi"] });
  assert.equal(reading(hass, index, "pm10")?.value, 61);
  assert.equal(reading(hass, index, "volatile_organic_compounds_parts")?.unit, "ppb");
});

test("sensor_entities reads numeric sensors by entity, with or without a device class, in the given order", () => {
  const hass = airHass();
  const r = entityReadings(hass, ["sensor.office_monitor_radon", "sensor.office_monitor_status", "sensor.office_monitor_dead", "sensor.missing", "sensor.office_monitor_pm10"]);
  assert.deepEqual(r.map((x) => x.entities[0]), ["sensor.office_monitor_radon", "sensor.office_monitor_pm10"]);
  assert.deepEqual(r[0], { deviceClass: "", value: 38, unit: "Bq/m³", entities: ["sensor.office_monitor_radon"] });
  assert.equal(r[1].deviceClass, "pm10");
  assert.deepEqual(entityReadings(hass), []);
});

test("entities in sensor_entities and the mode selector re-render the card", () => {
  const index = { primary: [], withDiagnostic: [], unfilteredCount: 0 };
  const w = watchedEntities({ type: "x", area: "a", sensor_entities: ["sensor.radon"], mode_entity: "input_select.kitchen_mode", modes: [{ entity: "scene.cooking" }, {}] }, index);
  assert.ok(w.has("sensor.radon"));
  assert.ok(w.has("input_select.kitchen_mode"));
  assert.ok(w.has("scene.cooking"));
});

// ---- Main light: template lights and relays (issue #2) --------------------------

test("a light's own colour tints the card: RGB, RGBW, kelvin, mireds, hue/saturation and xy", () => {
  assert.deepEqual(lightColor(state("light.a", "on", { rgb_color: [255, 120, 40] })), [255, 120, 40]);
  assert.deepEqual(lightColor(state("light.a", "on", { rgbw_color: [10, 20, 30, 255] })), [10, 20, 30]);
  assert.deepEqual(lightColor(state("light.a", "on", { color_temp_kelvin: 2700 })), lightColor(state("light.b", "on", { color_temp: 370.37 })));
  assert.deepEqual(lightColor(state("light.a", "on", { hs_color: [0, 100] })), [255, 0, 0]);
  const xyRed = lightColor(state("light.a", "on", { xy_color: [0.64, 0.33] }));
  assert.ok(xyRed[0] === 255 && xyRed[1] < 40 && xyRed[2] < 40, String(xyRed));
  assert.equal(lightColor(state("light.a", "off", { rgb_color: [255, 0, 0] })), undefined);
});

test("a template light with None or text in its colour attributes still glows, never with invalid values", () => {
  // What a template light reports when its colour template renders nothing: the card falls back to the next
  // attribute, then to the theme's "on" colour (undefined here), instead of writing "null,null,null" into CSS.
  const broken = state("light.tpl", "on", { color_mode: "rgb", rgb_color: [null, null, null], brightness: "None", supported_color_modes: ["rgb"] });
  assert.equal(lightColor(broken), undefined);
  const hsOnly = state("light.tpl", "on", { color_mode: "hs", rgb_color: null, hs_color: ["30", "100"] });
  assert.deepEqual(lightColor(hsOnly), [255, 128, 0]);
  const strings = state("light.tpl", "on", { rgb_color: ["255", "100", "0"] });
  assert.deepEqual(lightColor(strings), [255, 100, 0]);
  const outOfRange = state("light.tpl", "on", { rgb_color: [300, -5, 12.6] });
  assert.deepEqual(lightColor(outOfRange), [255, 0, 13]);
  for (const v of [lightColor(broken), lightColor(hsOnly), lightColor(strings)].flat()) assert.ok(v === undefined || Number.isFinite(v));
});

test("glow strength follows brightness and survives a missing or broken one", () => {
  assert.equal(glowAlpha(state("light.a", "on", { brightness: 255 })), 0.22);
  assert.equal(glowAlpha(state("light.a", "on", { brightness: 0 })), 0.1);
  assert.equal(glowAlpha(state("switch.relay", "on")), 0.22);
  assert.equal(glowAlpha(state("light.tpl", "on", { brightness: "None" })), 0.22);
  assert.equal(glowAlpha(state("light.tpl", "on", { brightness: null })), 0.22);
  assert.ok(Number.isFinite(glowAlpha(undefined)));
});

test("main_light can be a relay switch or an input_boolean; discovery still only picks lights", () => {
  const hass = makeHass();
  hass.states["switch.lounge_relay"] = state("switch.lounge_relay", "on");
  hass.entities["switch.lounge_relay"] = { entity_id: "switch.lounge_relay", area_id: "lounge" };
  hass.states["input_boolean.lounge_lamp"] = state("input_boolean.lounge_lamp", "off");
  hass.states["light.lounge_tpl"] = state("light.lounge_tpl", "on", { rgb_color: [null, null, null] });
  const cfg = { type: "x", area: "lounge" };
  const index = indexArea(hass, "lounge");
  assert.equal(findMainLight(hass, { ...cfg, main_light: "switch.lounge_relay" }, index), "switch.lounge_relay");
  assert.equal(findMainLight(hass, { ...cfg, main_light: "input_boolean.lounge_lamp" }, index), "input_boolean.lounge_lamp");
  assert.equal(findMainLight(hass, { ...cfg, main_light: "light.lounge_tpl" }, index), "light.lounge_tpl");
  assert.equal(findMainLight(hass, { ...cfg, main_light: "switch.missing" }, index), undefined);
  assert.equal(findMainLight(hass, { ...cfg, main_light: "switch.lounge_relay", link_main_light: false }, index), undefined);
  // Without config the relay is never picked: the ceiling light (by name) is.
  assert.equal(findMainLight(hass, cfg, index), "light.lounge_ceiling");
  // A relay has no colour of its own: the card glows in the theme's "on" colour.
  assert.equal(lightColor(hass.states["switch.lounge_relay"]), undefined);
});
