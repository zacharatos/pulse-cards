import test from "node:test";
import assert from "node:assert/strict";

import { hasLabelFilter, passesLabelFilter, resolveLabelFilter, toList } from "../src/labels.ts";

const registry = [
  { label_id: "on_card", name: "On card" },
  { label_id: "noisy", name: "Noisy" },
];

test("toList accepts a string, a list or nothing", () => {
  assert.deepEqual(toList("a"), ["a"]);
  assert.deepEqual(toList([" a ", "", "b"]), ["a", "b"]);
  assert.deepEqual(toList(undefined), []);
});

test("an empty config is not a filter", () => {
  assert.equal(hasLabelFilter(undefined), false);
  assert.equal(hasLabelFilter({ include: [], exclude: "" }), false);
  assert.equal(resolveLabelFilter({}).active, false);
  assert.equal(passesLabelFilter([], [], resolveLabelFilter({})), true);
});

test("labels resolve by id or by display name, case-insensitively", () => {
  const f = resolveLabelFilter({ include: ["ON CARD", "noisy"] }, registry);
  assert.deepEqual([...f.include].sort(), ["noisy", "on_card"]);
});

test("without a registry tokens are treated as ids", () => {
  const f = resolveLabelFilter({ include: "on_card" });
  assert.deepEqual([...f.include], ["on_card"]);
});

test("include: any label is enough by default", () => {
  const f = resolveLabelFilter({ include: ["on_card", "noisy"] }, registry);
  assert.equal(passesLabelFilter(["noisy"], [], f), true);
  assert.equal(passesLabelFilter(["other"], [], f), false);
  assert.equal(passesLabelFilter([], [], f), false);
});

test("match: all needs every label, and may combine entity and device labels", () => {
  const f = resolveLabelFilter({ include: ["on_card", "noisy"], match: "all" }, registry);
  assert.equal(passesLabelFilter(["on_card"], [], f), false);
  assert.equal(passesLabelFilter(["on_card"], ["noisy"], f), true);
});

test("labels on the device count unless from_device is false", () => {
  const on = resolveLabelFilter({ include: "on_card" }, registry);
  const off = resolveLabelFilter({ include: "on_card", from_device: false }, registry);
  assert.equal(passesLabelFilter([], ["on_card"], on), true);
  assert.equal(passesLabelFilter([], ["on_card"], off), false);
  assert.equal(passesLabelFilter(["on_card"], [], off), true);
});

test("exclude always wins over include", () => {
  const f = resolveLabelFilter({ include: "on_card", exclude: "noisy" }, registry);
  assert.equal(passesLabelFilter(["on_card", "noisy"], [], f), false);
  assert.equal(passesLabelFilter(["on_card"], [], f), true);
});

test("exclude alone hides only the excluded", () => {
  const f = resolveLabelFilter({ exclude: "noisy" }, registry);
  assert.equal(passesLabelFilter([], [], f), true);
  assert.equal(passesLabelFilter(["noisy"], [], f), false);
});
