import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_WIDGET_LAYOUT,
  WIDGET_LAYOUT_STORAGE_KEY,
  moveWidgetToIndex,
  readWidgetLayout,
  saveWidgetLayout,
} from "../src/utils/widgetLayout.js";
import { clampWindowPosition, getCenteredWindowPosition } from "../src/utils/floatingWindow.js";

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
  for (const value of ["not json", JSON.stringify(["github"]), JSON.stringify(["hero", "github", "github", "linkedin", "terminal", "clock", "memoji"])]) {
    assert.deepEqual(readWidgetLayout(storage({ [WIDGET_LAYOUT_STORAGE_KEY]: value })), DEFAULT_WIDGET_LAYOUT);
  }
});

test("saves and restores a valid order", () => {
  const memory = storage();
  const layout = ["clock", "linkedin", "github", "reminders", "memoji", "hero", "terminal"];
  assert.equal(saveWidgetLayout(layout, memory), true);
  assert.deepEqual(readWidgetLayout(memory), layout);
});

test("moves a widget to any insertion index without changing the other order", () => {
  assert.deepEqual(
    moveWidgetToIndex(DEFAULT_WIDGET_LAYOUT, "clock", 0),
    ["clock", "hero", "reminders", "github", "linkedin", "terminal", "memoji"],
  );
  assert.deepEqual(
    moveWidgetToIndex(DEFAULT_WIDGET_LAYOUT, "reminders", 3),
    ["hero", "github", "linkedin", "reminders", "terminal", "clock", "memoji"],
  );
});

test("centers and keeps floating windows within the viewport margins", () => {
  assert.deepEqual(
    getCenteredWindowPosition({ width: 400, height: 240 }, { width: 1000, height: 700 }),
    { x: 300, y: 230 },
  );
  assert.deepEqual(
    clampWindowPosition({ x: -20, y: 900 }, { width: 400, height: 240 }, { width: 1000, height: 700 }),
    { x: 8, y: 452 },
  );
});
