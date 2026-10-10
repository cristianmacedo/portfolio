import { expect, test } from "@playwright/test";

const widget = (page, id) => page.locator(`[data-widget-id="${id}"]`);

async function enterEditing(page, id) {
  await widget(page, id).scrollIntoViewIfNeeded();
  const box = await widget(page, id).boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(560);
  await expect(page.locator(".layout-drag-preview")).toBeVisible();
  await expect(page.locator(".top-grid")).toHaveAttribute("data-layout-editing", "true");
  return box;
}

async function finishPointer(page) {
  await page.mouse.up();
  await expect(page.locator(".layout-drag-preview")).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("long press starts an attached preview, reorders widgets, and saves the result", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const github = await enterEditing(page, "github");
  const destination = await widget(page, "reminders").boundingBox();

  await page.mouse.move(destination.x + 20, destination.y + 20, { steps: 10 });
  const preview = await page.locator(".layout-drag-preview").boundingBox();
  expect(preview.x).not.toBeCloseTo(github.x, 0);

  await finishPointer(page);
  const saved = await page.evaluate(() => localStorage.getItem("portfolio-widget-layout"));
  expect(JSON.parse(saved)).not.toEqual(["reminders", "github", "linkedin", "clock"]);

  await page.reload();
  await expect(widget(page, "github")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("portfolio-widget-layout"))).toBe(saved);
});

test("short click keeps the reminder editable and social links interactive", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const reminder = page.locator(".reminder-copy").first();
  await reminder.click();
  await expect(reminder).toBeFocused();

  const defaultPrevented = await widget(page, "github").evaluate((link) => {
    let prevented = null;
    link.addEventListener("click", (event) => { prevented = event.defaultPrevented; }, { once: true });
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    return prevented;
  });
  expect(defaultPrevented).toBe(false);
});

test("a 2×2 clock preview preserves the widget's internal surface", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const previewSource = await enterEditing(page, "clock");
  const preview = await page.locator(".layout-drag-preview").boundingBox();
  const clockSurface = await page
    .locator(".layout-drag-preview .ios-clock-widget")
    .boundingBox();

  expect(preview.width).toBeGreaterThan(previewSource.width);
  expect(clockSurface.width).toBeGreaterThan(preview.width * 0.9);
  expect(clockSurface.height).toBeGreaterThan(preview.height * 0.9);
  await finishPointer(page);
});

test("touch long press reorders a 2×2 widget without scrolling", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const clock = await enterEditing(page, "clock");
  const beforeDragScroll = await page.evaluate(() => scrollY);
  const reminders = await widget(page, "reminders").boundingBox();
  await page.mouse.move(reminders.x + 24, reminders.y + 24, { steps: 8 });
  await finishPointer(page);

  expect(await page.evaluate(() => scrollY)).toBe(beforeDragScroll);
  expect(clock.width).toBeGreaterThan(150);
  await context.close();
});
