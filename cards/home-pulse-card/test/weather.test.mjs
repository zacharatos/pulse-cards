import { test } from "node:test";
import assert from "node:assert/strict";

import { forecastType, todayRange } from "../src/weather.ts";

const weather = (supported_features) => ({ entity_id: "weather.home", state: "sunny", attributes: { supported_features }, last_changed: "", last_updated: "" });
const at = (h, dayOffset = 0) => {
  const d = new Date(2026, 9, 8, h, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString();
};
const now = new Date(2026, 9, 8, 9, 30);

test("forecast type: daily first, then twice-daily, then hourly", () => {
  assert.equal(forecastType(weather(1 | 2 | 4)), "daily");
  assert.equal(forecastType(weather(2 | 4)), "twice_daily");
  assert.equal(forecastType(weather(2)), "hourly");
  assert.equal(forecastType(weather(0)), undefined);
  assert.equal(forecastType(weather(undefined)), undefined);
  assert.equal(forecastType(undefined), undefined);
});

test("daily: today's entry, rounded", () => {
  const items = [
    { datetime: at(12), temperature: 26.6, templow: 17.4 },
    { datetime: at(12, 1), temperature: 22, templow: 15 },
  ];
  assert.deepEqual(todayRange(items, "daily", now), { high: 27, low: 17 });
  // Some providers start at tomorrow's date (midnight UTC): take the first entry.
  assert.deepEqual(todayRange(items.slice(1), "daily", now), { high: 22, low: 15 });
  // No low: only the high.
  assert.deepEqual(todayRange([{ datetime: at(12), temperature: 25 }], "daily", now), { high: 25 });
});

test("twice-daily: max and min of today's halves", () => {
  const items = [
    { datetime: at(6), temperature: 24, templow: 16, is_daytime: true },
    { datetime: at(18), temperature: 19, templow: 13, is_daytime: false },
    { datetime: at(6, 1), temperature: 30, templow: 20, is_daytime: true },
  ];
  assert.deepEqual(todayRange(items, "twice_daily", now), { high: 24, low: 13 });
});

test("hourly: the rest of today, needs a few hours", () => {
  const items = [10, 11, 12, 13, 14].map((h, i) => ({ datetime: at(h), temperature: [18, 21, 24.4, 23, 20][i] }));
  assert.deepEqual(todayRange(items, "hourly", now), { high: 24, low: 18 });
  assert.equal(todayRange(items.slice(0, 2), "hourly", now), undefined);
});

test("nothing usable: no range", () => {
  assert.equal(todayRange(undefined, "daily", now), undefined);
  assert.equal(todayRange([], "daily", now), undefined);
  assert.equal(todayRange([{ datetime: "nope", temperature: 20 }], "daily", now), undefined);
  assert.equal(todayRange([{ datetime: at(12) }], "daily", now), undefined);
  // Same high and low (a flat hourly day) reads as just the high.
  assert.deepEqual(todayRange([12, 13, 14].map((h) => ({ datetime: at(h), temperature: 20 })), "hourly", now), { high: 20 });
});
