import { chromium, firefox, webkit } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const origin = process.env.TEST_URL || "http://127.0.0.1:3000";
await mkdir("qa/screenshots", { recursive: true });
const report = {
  origin,
  date: new Date().toISOString(),
  viewports: [],
  checks: [],
  skipped: [],
  errors: [],
  resources: {},
};
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage({ deviceScaleFactor: 1 });
page.on("pageerror", (e) => report.errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") report.errors.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400) report.errors.push(`HTTP ${r.status()} ${r.url()}`);
});
const sizes = [
  [320, 740],
  [360, 800],
  [375, 812],
  [390, 844],
  [414, 896],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1280, 800],
  [1366, 768],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
  [3440, 1440],
  [3840, 2160],
];
for (const [width, height] of sizes) {
  await page.setViewportSize({ width, height });
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.screenshot({ path: `qa/screenshots/hero-${width}x${height}.png` });
  const initial = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewport: innerWidth,
    h1: document.querySelector("h1").getBoundingClientRect().toJSON(),
    button: document
      .querySelector(".opening-copy .order-button")
      .getBoundingClientRect()
      .toJSON(),
  }));
  await page.locator(".scene-navigation button").nth(2).click();
  await page.waitForTimeout(1400);
  const scene = await page
    .locator(".scene-sear")
    .evaluate((el) => ({
      opacity: Number(getComputedStyle(el).opacity),
      visibility: getComputedStyle(el).visibility,
      top: document.querySelector(".film-stage").getBoundingClientRect().top,
    }));
  await page.screenshot({ path: `qa/screenshots/sear-${width}x${height}.png` });
  await page.locator("#cardapio").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const horizontal = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  await page.screenshot({ path: `qa/screenshots/menu-${width}x${height}.png` });
  report.viewports.push({
    width,
    height,
    noHorizontalOverflow: initial.scrollWidth === width && !horizontal,
    heroCtaInViewport: initial.button.bottom < height,
    scenePinned: Math.abs(scene.top) < 1,
    sceneVisible: scene.opacity > 0.98,
  });
}
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(origin, { waitUntil: "networkidle" });
for (let i = 0; i < 6; i++) {
  await page.locator(".scene-navigation button").nth(i).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `qa/screenshots/scene-${i + 1}-desktop.png` });
  report.checks.push({
    name: `scene-${i + 1}`,
    pass: await page
      .locator(".process-panel")
      .nth(i)
      .evaluate((el) => Number(getComputedStyle(el).opacity) > 0.98),
  });
  report.checks.push({
    name: `scene-${i + 1}-copy-fits`,
    pass: await page
      .locator(".process-panel")
      .nth(i)
      .locator(".scene-copy")
      .evaluate((el) => {
        const b = el.getBoundingClientRect();
        const end = document
          .querySelector(".film-bottom")
          .getBoundingClientRect().top;
        return b.top > 100 && b.bottom < end;
      }),
  });
}
await page.locator(".scene-navigation button").nth(0).click();
await page.waitForTimeout(1200);
report.checks.push({
  name: "reverse-scroll",
  pass: await page
    .locator(".scene-beef")
    .evaluate((el) => Number(getComputedStyle(el).opacity) > 0.98),
});
await page.locator("#sobre").scrollIntoViewIfNeeded();
await page.screenshot({ path: "qa/screenshots/story-desktop.png" });
await page.locator(".final-cta").scrollIntoViewIfNeeded();
await page.screenshot({ path: "qa/screenshots/final-desktop.png" });
await page.locator("#contato").scrollIntoViewIfNeeded();
await page.screenshot({ path: "qa/screenshots/footer-desktop.png" });
const targets = await page
  .locator(".order-button,.floating-order")
  .evaluateAll((els) => els.map((el) => el.href));
report.checks.push({
  name: "centralized-order-links",
  pass:
    new Set(targets).size === 1 &&
    targets[0].startsWith("https://wa.me/5534998275292?text="),
});
const broken = await page.evaluate(() =>
  [...document.images]
    .filter((el) => el.complete && !el.naturalWidth)
    .map((el) => el.src),
);
report.checks.push({
  name: "no-broken-images",
  pass: broken.length === 0,
  detail: broken,
});
const schema = await page
  .locator('script[type="application/ld+json"]')
  .textContent();
report.checks.push({
  name: "restaurant-schema",
  pass: JSON.parse(schema)["@type"] === "Restaurant",
});
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(origin, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Abrir menu" }).click();
await page.screenshot({ path: "qa/screenshots/mobile-navigation.png" });
report.checks.push({
  name: "menu-locks-background",
  pass: await page.evaluate(() => document.body.style.overflow === "hidden"),
});
await page.keyboard.press("Escape");
report.checks.push({
  name: "escape-closes-menu-and-restores-focus",
  pass:
    (await page
      .getByRole("button", { name: "Abrir menu" })
      .evaluate((el) => el === document.activeElement)) &&
    (await page.evaluate(() => document.body.style.overflow !== "hidden")),
});
await page.getByRole("button", { name: "Abrir menu" }).click();
await page
  .locator(".mobile-nav")
  .getByRole("link", { name: "03 Cardápio" })
  .click();
await page.waitForTimeout(1000);
report.checks.push({
  name: "menu-navigates-and-closes",
  pass:
    (await page
      .getByRole("button", { name: "Abrir menu" })
      .getAttribute("aria-expanded")) === "false" &&
    (await page.evaluate(() => location.hash === "#cardapio")),
});
await page.locator("#sobre").scrollIntoViewIfNeeded();
await page.screenshot({ path: "qa/screenshots/story-mobile.png" });
await page.locator(".final-cta").scrollIntoViewIfNeeded();
await page.screenshot({ path: "qa/screenshots/final-mobile.png" });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(origin, { waitUntil: "networkidle" });
const staticScenes = await page
  .locator(".process-panel")
  .evaluateAll((els) =>
    els.every(
      (el) =>
        getComputedStyle(el).position === "relative" &&
        Number(getComputedStyle(el).opacity) === 1,
    ),
  );
report.checks.push({
  name: "reduced-motion-static-scenes",
  pass: staticScenes,
});
await page.locator(".scene-build").scrollIntoViewIfNeeded();
await page.screenshot({ path: "qa/screenshots/reduced-motion-mobile.png" });
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.goto(origin, { waitUntil: "networkidle" });
report.resources = await page.evaluate(() => ({
  loadedImages: performance
    .getEntriesByType("resource")
    .filter((r) => r.name.includes("/assets/")).length,
  imageTransferBytes: performance
    .getEntriesByType("resource")
    .filter((r) => r.name.includes("/assets/"))
    .reduce((n, r) => n + r.transferSize, 0),
  fontRequests: performance
    .getEntriesByType("resource")
    .filter((r) => r.name.includes(".woff")).length,
}));
// Short-screen landscape and browser zoom equivalent remain scrollable and usable.
await page.setViewportSize({ width: 844, height: 390 });
await page.goto(origin, { waitUntil: "networkidle" });
await page.screenshot({ path: "qa/screenshots/landscape-phone.png" });
report.checks.push({
  name: "landscape-no-overflow",
  pass: await page.evaluate(
    () => document.documentElement.scrollWidth === innerWidth,
  ),
});
await browser.close();
for (const [name, type] of [
  ["firefox", firefox],
  ["webkit", webkit],
]) {
  try {
    const engine = await type.launch({ headless: true });
    const tab = await engine.newPage({ viewport: { width: 390, height: 844 } });
    tab.on("pageerror", (e) => report.errors.push(`${name}: ${e.message}`));
    await tab.goto(origin, { waitUntil: "networkidle" });
    await tab.locator(".scene-navigation button").nth(3).click();
    await tab.waitForTimeout(1500);
    report.checks.push({
      name: `${name}-scroll-and-width`,
      pass: await tab
        .locator(".scene-melt")
        .evaluate(
          (el) =>
            Number(getComputedStyle(el).opacity) > 0.98 &&
            document.documentElement.scrollWidth === innerWidth,
        ),
    });
    await tab.screenshot({ path: `qa/screenshots/${name}-mobile.png` });
    await engine.close();
  } catch (e) {
    report.skipped.push({ name: `${name}-available`, reason: e.message });
  }
}
await writeFile("qa/report.json", JSON.stringify(report, null, 2));
const failed = [
  ...report.viewports.filter(
    (v) =>
      !v.noHorizontalOverflow ||
      !v.heroCtaInViewport ||
      !v.scenePinned ||
      !v.sceneVisible,
  ),
  ...report.checks.filter((c) => !c.pass),
];
console.log(
  JSON.stringify(
    {
      viewports: report.viewports.length,
      checks: report.checks.length,
      failed,
      skipped: report.skipped,
      errors: report.errors,
      resources: report.resources,
    },
    null,
    2,
  ),
);
if (failed.length || report.errors.length) process.exitCode = 1;
