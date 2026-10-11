import { test } from "node:test";
import assert from "node:assert/strict";

import { localize, relativeTime } from "../src/localize.ts";

const hass = (language) => ({ language, locale: { language } });

test("placeholders and fallbacks", () => {
  assert.equal(localize(hass("en"), "for_mode", { mode: "Night" }), "For Night");
  assert.equal(localize(hass("el"), "for_mode", { mode: "Νύχτα" }), "Για Νύχτα");
  assert.equal(localize(hass("fr"), "title"), "Scenes");
});

test("every key exists in English and Greek with the same placeholders", async () => {
  const src = await import("node:fs").then((fs) => fs.readFileSync(new URL("../src/localize.ts", import.meta.url), "utf8"));
  const block = (name) => src.split(`const ${name}: Dict = {`)[1].split("\n};")[0];
  const keys = (b) => Object.fromEntries([...b.matchAll(/^\s+(\w+): "(.*)",$/gm)].map((m) => [m[1], [...m[2].matchAll(/\{(\w+)\}/g)].map((x) => x[1]).sort().join()]));
  const en = keys(block("en"));
  const el = keys(block("el"));
  assert.deepEqual(Object.keys(el).sort(), Object.keys(en).sort());
  for (const k of Object.keys(en)) assert.equal(el[k], en[k], `placeholders of ${k}`);
});

test("relative time", () => {
  const now = Date.parse("2026-10-10T12:00:00Z");
  assert.equal(relativeTime(hass("en"), "2026-10-10T11:59:50Z", now), "just now");
  assert.equal(relativeTime(hass("en"), "2026-10-08T12:00:00Z", now), "2 days ago");
});
