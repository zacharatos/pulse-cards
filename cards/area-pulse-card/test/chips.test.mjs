import test from "node:test";
import assert from "node:assert/strict";

import { CHIP_PRIORITY, DEFAULT_MAX_CHIPS, chipTone, pickChips, readingSeverity } from "../src/discovery.ts";

const g = (group, active = true) => ({ group, active });
const ids = (list) => list.map((c) => c.group);

test("the default cap is three chips", () => {
  assert.equal(DEFAULT_MAX_CHIPS, 3);
});

test("max 0 shows every chip in the configured order", () => {
  const items = [g("motion"), g("lights"), g("doors", false)];
  const { shown, hidden } = pickChips(items, 0);
  assert.deepEqual(ids(shown), ["motion", "lights", "doors"]);
  assert.equal(hidden.length, 0);
});

test("problems, then openings, then lights, then climate and media", () => {
  const items = ["motion", "media", "switches", "climate", "lights", "windows", "locks", "batteries"].map((x) => g(x));
  const { shown, hidden } = pickChips(items, 3);
  assert.deepEqual(ids(shown), ["batteries", "locks", "windows"]);
  assert.deepEqual(ids(hidden), ["lights", "climate", "media", "switches", "motion"]);
});

test("inactive chips only fill free slots, and never count towards +N", () => {
  const items = [g("doors", false), g("windows", false), g("switches"), g("lights", false), g("media")];
  const { shown, hidden } = pickChips(items, 3);
  assert.deepEqual(ids(shown), ["media", "switches", "doors"]);
  assert.equal(hidden.length, 0);
  const busy = pickChips([g("doors", false), ...["lights", "media", "climate", "switches", "fans"].map((x) => g(x))], 3);
  assert.deepEqual(ids(busy.shown), ["lights", "climate", "media"]);
  assert.deepEqual(ids(busy.hidden), ["fans", "switches"]);
});

test("exactly one chip too many shows it instead of +1; two too many give +2", () => {
  const four = pickChips(["lights", "media", "climate", "switches"].map((x) => g(x)), 3);
  assert.deepEqual(ids(four.shown), ["lights", "climate", "media", "switches"]);
  assert.equal(four.hidden.length, 0);
  const five = pickChips(["lights", "media", "climate", "switches", "fans"].map((x) => g(x)), 3);
  assert.equal(five.shown.length, 3);
  assert.equal(five.hidden.length, 2);
  // Inactive chips never turn a full face into four chips.
  const full = pickChips([...["lights", "media", "climate"].map((x) => g(x)), g("doors", false)], 3);
  assert.deepEqual(ids(full.shown), ["lights", "climate", "media"]);
});

test("a room with nothing active has an empty face; max 0 keeps inactive chips", () => {
  const { shown, hidden } = pickChips([], 3);
  assert.equal(shown.length + hidden.length, 0);
  assert.equal(pickChips([g("doors", false)], 0).shown.length, 1);
});

test("readings in the climate block are coloured only when out of range", () => {
  const r = (deviceClass, value) => readingSeverity({ deviceClass, value });
  assert.equal(r("carbon_dioxide", 800), "");
  assert.equal(r("carbon_dioxide", 1120), "warn");
  assert.equal(r("carbon_dioxide", 1500), "bad");
  assert.equal(r("pm25", 9), "");
  assert.equal(r("pm25", 12), "warn");
  assert.equal(r("pm25", 40), "bad");
  for (const dc of ["illuminance", "pressure", "power"]) assert.equal(r(dc, 99999), "", dc);
});

test("ties keep the configured order, and nothing is hidden when everything fits", () => {
  const items = [g("lights"), g("doors")];
  const { shown, hidden } = pickChips(items, 3);
  assert.deepEqual(ids(shown), ["doors", "lights"]);
  assert.equal(hidden.length, 0);
});

test("every group has a place in the priority list", () => {
  for (const id of ["motion", "doors", "windows", "covers", "locks", "lights", "fans", "switches", "media", "climate", "alerts", "batteries"])
    assert.ok(CHIP_PRIORITY.includes(id), id);
});

test("colour only for problems, openings and lights", () => {
  assert.equal(chipTone("alerts"), "bad");
  assert.equal(chipTone("batteries"), "bad");
  assert.equal(chipTone("locks"), "bad");
  assert.equal(chipTone("doors"), "warn");
  assert.equal(chipTone("windows"), "warn");
  assert.equal(chipTone("lights"), "on");
  for (const id of ["motion", "covers", "fans", "switches", "media", "climate"]) assert.equal(chipTone(id), "", id);
});
