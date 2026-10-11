import { test } from "node:test";
import assert from "node:assert/strict";

import { discoverModeEntity, guessModeIcon, modeEntities, resolveModes } from "../src/modes.ts";
import { dayDiff, formatTodayItem, parseLocal, todayCalendars, todayItems, todayWatched } from "../src/today.ts";

const st = (entity_id, state, attributes = {}) => ({ entity_id, state, attributes, last_changed: "", last_updated: "" });
const mk = (...list) => ({ states: Object.fromEntries(list.map((s) => [s.entity_id, s])), entities: {}, devices: {}, areas: {}, language: "en" });

// ---- Modes ------------------------------------------------------------------

test("mode icons are guessed from English and Greek names", () => {
  assert.equal(guessModeIcon("Away"), "mdi:home-export-outline");
  assert.equal(guessModeIcon("Νύχτα"), "mdi:weather-night");
  assert.equal(guessModeIcon("Movie night"), "mdi:weather-night"); // first match wins
  assert.equal(guessModeIcon("Ταινία"), "mdi:movie-open-outline");
  assert.equal(guessModeIcon("Workout"), "mdi:briefcase-outline");
  assert.equal(guessModeIcon("Home"), "mdi:home-outline");
  assert.equal(guessModeIcon("Zen"), "mdi:circle-outline");
});

test("only house_mode/home_mode selects are discovered", () => {
  assert.equal(discoverModeEntity(mk(st("input_select.ac_mode", "cool")), {}), undefined);
  assert.equal(discoverModeEntity(mk(st("input_select.house_mode", "Home")), {}), "input_select.house_mode");
  assert.equal(discoverModeEntity(mk(st("input_select.house_mode", "Home")), { mode_entity: "none" }), undefined);
  assert.equal(discoverModeEntity(mk(), { mode_entity: "select.x" }), "select.x");
});

test("an input_select alone gives one button per option, current one active", () => {
  const hass = mk(st("input_select.house_mode", "Night", { options: ["Home", "Away", "Night"] }));
  const modes = resolveModes(hass, {});
  assert.deepEqual(modes.map((m) => [m.name, m.active]), [["Home", false], ["Away", false], ["Night", true]]);
  assert.deepEqual(modes[1].tap_action, {
    action: "perform-action",
    perform_action: "input_select.select_option",
    target: { entity_id: "input_select.house_mode" },
    data: { option: "Away" },
  });
});

test("listed modes: name doubles as option, explicit option wins, select domain is respected", () => {
  const hass = mk(st("select.mode", "guest", { options: ["home", "guest"] }));
  const modes = resolveModes(hass, {
    mode_entity: "select.mode",
    modes: [{ name: "Home", option: "home", icon: "mdi:home" }, { name: "Guests", option: "guest" }, { name: "Odd" }],
  });
  assert.deepEqual(modes.map((m) => m.active), [false, true, false]);
  assert.equal(modes[0].tap_action.perform_action, "select.select_option");
  assert.equal(modes[2].tap_action.data.option, "Odd");
  assert.equal(modes[0].icon, "mdi:home");
  assert.equal(modes[1].icon, "mdi:account-group-outline");
});

test("scene modes: the most recently activated scene is the active one", () => {
  const hass = mk(
    st("scene.movie", "2026-10-05T19:00:00+00:00", { friendly_name: "Movie" }),
    st("scene.night", "2026-10-04T23:00:00+00:00", { friendly_name: "Night" }),
    st("scene.never", "unknown", { friendly_name: "Never" }),
    st("input_boolean.guests", "on", { friendly_name: "Guests" })
  );
  const modes = resolveModes(hass, {
    modes: [{ entity: "scene.movie" }, { entity: "scene.night" }, { entity: "scene.never" }, { entity: "input_boolean.guests" }],
  });
  assert.deepEqual(modes.map((m) => [m.name, m.active]), [["Movie", true], ["Night", false], ["Never", false], ["Guests", true]]);
  assert.deepEqual(modes[0].tap_action, { action: "perform-action", perform_action: "scene.turn_on", target: { entity_id: "scene.movie" } });
  assert.deepEqual(modes[3].tap_action, { action: "toggle", entity: "input_boolean.guests" });
  assert.deepEqual(modeEntities(hass, { modes: [{ entity: "scene.movie" }] }), ["scene.movie"]);
});

test("empty modes (just added in the editor) are skipped; all empty falls back to the options", () => {
  const hass = mk(st("input_select.house_mode", "Home", { options: ["Home", "Away"] }));
  assert.deepEqual(resolveModes(hass, { modes: [{}, { name: "" }] }).map((m) => m.name), ["Home", "Away"]);
  assert.deepEqual(resolveModes(hass, { modes: [{}, { name: "Away" }] }).map((m) => m.name), ["Away"]);
});

test("no mode entity and no list: no modes", () => {
  assert.deepEqual(resolveModes(mk(), {}), []);
});

// ---- Today ------------------------------------------------------------------

const NOW = new Date(2026, 9, 5, 15, 0); // Monday 5 Oct 2026, 15:00 local
const cal = (id, state, message, start, end, all_day = false) =>
  st(id, state, { message, start_time: start, end_time: end, all_day, friendly_name: id });

test("local parsing and day differences", () => {
  assert.equal(parseLocal("2026-10-05 17:30:00").getHours(), 17);
  assert.equal(parseLocal("2026-10-06").getDate(), 6);
  assert.equal(parseLocal("nope"), undefined);
  assert.equal(dayDiff(NOW, new Date(2026, 9, 5, 23, 59)), 0);
  assert.equal(dayDiff(NOW, new Date(2026, 9, 6, 0, 1)), 1);
});

test("calendars: today, running now, tomorrow; past and later ones are left out", () => {
  const hass = mk(
    cal("calendar.family", "off", "Dentist", "2026-10-05 17:30:00", "2026-10-05 18:00:00"),
    cal("calendar.work", "on", "Standup", "2026-10-05 14:45:00", "2026-10-05 15:30:00"),
    cal("calendar.bins", "off", "Recycling", "2026-10-06 00:00:00", "2026-10-07 00:00:00", true),
    cal("calendar.later", "off", "Trip", "2026-10-09 09:00:00", "2026-10-09 10:00:00"),
    cal("calendar.empty", "off", "", "", "")
  );
  const items = todayItems(hass, {}, NOW);
  assert.deepEqual(items.map((i) => i.title), ["Standup", "Dentist", "Recycling"]);
  const t = (k, v = {}) => ({ today_until: `until ${v.time}`, today_tomorrow: "tomorrow", today_today: "today" })[k];
  const hm = (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  assert.deepEqual(items.map((i) => formatTodayItem(i, t, hm)), ["Standup until 15:30", "Dentist 17:30", "Recycling tomorrow"]);
  assert.deepEqual(todayItems(hass, { today: { tomorrow: false } }, NOW).map((i) => i.title), ["Standup", "Dentist"]);
  assert.deepEqual(todayItems(hass, { today: false }, NOW), []);
});

test("calendars: configured list wins over discovery, hidden ones are skipped", () => {
  const hass = mk(cal("calendar.a", "off", "A", "2026-10-05 20:00:00", ""), cal("calendar.b", "off", "B", "2026-10-05 21:00:00", ""));
  hass.entities = { "calendar.b": { entity_id: "calendar.b", hidden: true } };
  assert.deepEqual(todayCalendars(hass, {}), ["calendar.a"]);
  assert.deepEqual(todayCalendars(hass, { today: { calendars: ["calendar.b"] } }), ["calendar.b"]);
});

test("sensors: daysTo, date, timestamp, days unit and text", () => {
  const hass = mk(
    st("sensor.paper", "Paper in 1 day", { daysTo: 1, friendly_name: "Paper" }),
    st("sensor.glass", "Glass", { daysTo: 4, friendly_name: "Glass" }),
    st("sensor.service", "2026-10-05", { device_class: "date", friendly_name: "Boiler service" }),
    st("sensor.delivery", new Date(2026, 9, 6, 10, 0).toISOString(), { device_class: "timestamp", friendly_name: "Delivery" }),
    st("sensor.bio", "0", { unit_of_measurement: "days", friendly_name: "Bio" }),
    st("sensor.note", "Water the plants"),
    st("sensor.blank", "unknown")
  );
  const items = todayItems(
    hass,
    { today: { calendars: [], entities: ["sensor.paper", "sensor.glass", "sensor.service", "sensor.delivery", "sensor.bio", { entity: "sensor.note", name: "Note" }, "sensor.blank"] } },
    NOW
  );
  assert.deepEqual(items.map((i) => [i.title, i.day]), [
    ["Boiler service", 0],
    ["Bio", 0],
    ["Paper", 1],
    ["Delivery", 1],
    ["Note: Water the plants", undefined],
  ]);
  const t = (k) => ({ today_tomorrow: "tomorrow", today_today: "today" })[k];
  assert.equal(formatTodayItem(items[0], t, () => "x"), "Boiler service today");
  assert.equal(formatTodayItem(items[3], t, () => "10:00"), "Delivery tomorrow 10:00");
});

test("today watches its calendars and entities", () => {
  const hass = mk(cal("calendar.a", "off", "A", "", ""));
  assert.deepEqual(todayWatched(hass, { today: { entities: ["sensor.x", { entity: "sensor.y" }] } }), ["calendar.a", "sensor.x", "sensor.y"]);
  assert.deepEqual(todayWatched(hass, { today: false }), []);
});
