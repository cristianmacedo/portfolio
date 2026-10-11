export const WIDGET_LAYOUT_STORAGE_KEY = "portfolio-widget-layout";
export const DEFAULT_WIDGET_LAYOUT = [
  "hero",
  "reminders",
  "github",
  "linkedin",
  "terminal",
  "clock",
  "memoji",
];

export function isValidWidgetLayout(value) {
  return (
    Array.isArray(value) &&
    value.length === DEFAULT_WIDGET_LAYOUT.length &&
    value.every((id) => DEFAULT_WIDGET_LAYOUT.includes(id)) &&
    new Set(value).size === DEFAULT_WIDGET_LAYOUT.length
  );
}

export function readWidgetLayout(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(WIDGET_LAYOUT_STORAGE_KEY);
    const layout = raw ? JSON.parse(raw) : null;
    return isValidWidgetLayout(layout) ? layout : DEFAULT_WIDGET_LAYOUT;
  } catch {
    return DEFAULT_WIDGET_LAYOUT;
  }
}

export function saveWidgetLayout(layout, storage = globalThis.localStorage) {
  if (!isValidWidgetLayout(layout)) return false;
  try {
    storage?.setItem(WIDGET_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    return true;
  } catch {
    return false;
  }
}

export function moveWidgetToIndex(order, widgetId, index) {
  const currentIndex = order.indexOf(widgetId);
  if (currentIndex < 0) return order;
  const remaining = order.filter((id) => id !== widgetId);
  const nextIndex = Math.max(0, Math.min(index, remaining.length));
  const next = [...remaining];
  next.splice(nextIndex, 0, widgetId);
  return next;
}

export function layoutsMatch(left, right) {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}
