import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_WIDGET_LAYOUT,
  WIDGET_LAYOUT_STORAGE_KEY,
  moveWidgetToIndex,
  readWidgetLayout,
  saveWidgetLayout,
} from "../src/utils/widgetLayout.js";

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("uses the default widget order when no saved order exists", () => {
  assert.deepEqual(readWidgetLayout(storage()), DEFAULT_WIDGET_LAYOUT);
});

test("rejects malformed, duplicate, and incomplete saved orders", () => {
  for (const value of ["not json", JSON.stringify(["github"]), JSON.stringify(["github", "github", "linkedin", "clock"])]) {
    assert.deepEqual(readWidgetLayout(storage({ [WIDGET_LAYOUT_STORAGE_KEY]: value })), DEFAULT_WIDGET_LAYOUT);
  }
});

test("saves and restores a valid order", () => {
  const memory = storage();
  const layout = ["clock", "linkedin", "github", "reminders"];
  assert.equal(saveWidgetLayout(layout, memory), true);
  assert.deepEqual(readWidgetLayout(memory), layout);
});

test("moves a widget to any insertion index without changing the other order", () => {
  assert.deepEqual(
    moveWidgetToIndex(DEFAULT_WIDGET_LAYOUT, "clock", 0),
    ["clock", "reminders", "github", "linkedin"],
  );
  assert.deepEqual(
    moveWidgetToIndex(DEFAULT_WIDGET_LAYOUT, "reminders", 3),
    ["github", "linkedin", "clock", "reminders"],
  );
});
