import { expect, test } from "@playwright/test";

const widget = (page, id) => page.locator(`.top-grid > [data-widget-id="${id}"]`);

async function enterEditing(page, id) {
  await widget(page, id).scrollIntoViewIfNeeded();
  const box = await widget(page, id).boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(560);
  await expect(page.locator(".layout-drag-preview")).toBeVisible();
  await expect(page.locator(".layout-drag-preview")).toHaveClass(/is-layout-lifted/);
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
  expect(JSON.parse(saved)).not.toEqual(["hero", "reminders", "github", "linkedin", "terminal", "clock", "memoji"]);

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

test("the memoji is a separate 2×2 widget without the hero portrait", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(widget(page, "memoji")).toBeVisible();
  await expect(page.locator(".hero .portrait")).toHaveCount(0);

  const box = await widget(page, "memoji").boundingBox();
  expect(Math.abs(box.width - box.height)).toBeLessThan(2);
});

test("the terminal app is a standalone 1×1 widget", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(widget(page, "terminal")).toBeVisible();
  await expect(widget(page, "terminal").locator("img")).toHaveAttribute("src", /assets\/terminal\.png$/);

  const box = await widget(page, "terminal").boundingBox();
  expect(Math.abs(box.width - box.height)).toBeLessThan(2);
});

test("the terminal opens, stays open outside, drags, and returns focus on close", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await widget(page, "terminal").click();
  const terminal = page.locator(".terminal-window");
  await expect(terminal).toBeVisible();
  await expect(terminal).toContainText("cristian@portfolio — zsh — 80×24");

  await page.locator(".hero").click({ position: { x: 20, y: 20 } });
  await expect(terminal).toBeVisible();

  const before = await terminal.boundingBox();
  const titlebar = terminal.locator(".terminal-titlebar");
  const titleBox = await titlebar.boundingBox();
  await page.mouse.move(titleBox.x + 180, titleBox.y + 20);
  await page.mouse.down();
  await page.mouse.move(titleBox.x + 260, titleBox.y + 70, { steps: 6 });
  await page.mouse.up();
  const after = await terminal.boundingBox();
  expect(after.x).toBeGreaterThan(before.x + 40);

  await terminal.locator(".terminal-close").click();
  await expect(terminal).toHaveCount(0);
  await expect(widget(page, "terminal")).toBeFocused();
});

test("Spotlight opens the terminal action", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator(".spotlight-trigger").click();
  const input = page.locator(".spotlight-search input");
  await input.fill("terminal");
  await page.getByRole("option", { name: /Abrir Terminal|Open Terminal/ }).click();
  await expect(page.locator(".terminal-window")).toBeVisible();
  await expect(page.locator(".spotlight")).toHaveCount(0);
});

test("Spotlight closes outside and the terminal stays within mobile bounds", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator(".spotlight-trigger").click();
  await expect(page.locator(".spotlight")).toBeVisible();
  await page.locator(".hero").click({ position: { x: 16, y: 16 } });
  await expect(page.locator(".spotlight")).toHaveCount(0);

  await widget(page, "terminal").click();
  const terminal = page.locator(".terminal-window");
  const initial = await terminal.boundingBox();
  expect(initial.width).toBeLessThanOrEqual(366);
  const titlebar = terminal.locator(".terminal-titlebar");
  const titleBox = await titlebar.boundingBox();
  await page.mouse.move(titleBox.x + 120, titleBox.y + 20);
  await page.mouse.down();
  await page.mouse.move(900, 900, { steps: 8 });
  await page.mouse.up();
  const moved = await terminal.boundingBox();
  expect(moved.x).toBeGreaterThanOrEqual(12);
  expect(moved.y).toBeGreaterThanOrEqual(12);
  expect(moved.x + moved.width).toBeLessThanOrEqual(378);
  expect(moved.y + moved.height).toBeLessThanOrEqual(832);
  await context.close();
});

test("the hero is part of the draggable widget layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterEditing(page, "hero");
  await expect(widget(page, "hero")).toHaveClass(/is-layout-dragging/);
  await finishPointer(page);
});

test("pressing a widget darkens it before the long-press lift", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const github = widget(page, "github");
  const box = await github.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(github).toHaveClass(/is-layout-pressing/);
  await expect(page.locator(".layout-drag-preview")).toHaveCount(0);
  await page.mouse.up();
  await expect(github).not.toHaveClass(/is-layout-pressing/);
});

test("clicking outside the widgets closes edit mode", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterEditing(page, "github");
  await finishPointer(page);

  await page.locator(".projects-section").click({ position: { x: 20, y: 20 } });
  await expect(page.locator(".top-grid")).not.toHaveAttribute("data-layout-editing");
});

test("a 2×2 clock preview preserves the widget's internal surface", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const previewSource = await enterEditing(page, "clock");
  await page.waitForTimeout(200);
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
