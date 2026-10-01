import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await mkdir("qa/film", { recursive: true });
const result = { errors, viewports: [], checks: [] };
const origin = process.env.TEST_URL || "http://127.0.0.1:3000";
const canvas = page.locator(".continuous-film canvas");
const settle = async (expectedTime) => {
  // A continuous 0.4-second scrub must finish before comparing rendered poses.
  await page.waitForTimeout(600);
  await page.waitForFunction(
    (t) =>
      Math.abs(
        Number(document.querySelector(".continuous-film canvas").dataset.time) -
          t,
      ) < 0.001,
    expectedTime,
  );
};
const seek = async (time) => {
  const expectedTime = await page.evaluate((t) => {
    const root = document.querySelector(".experience");
    const start = root.getBoundingClientRect().top + scrollY;
    const distance = root.offsetHeight - innerHeight;
    window.scrollTo({
      top: start + (distance * t) / 7,
      behavior: "instant",
    });
    // Account for the browser rounding scroll offsets to physical CSS pixels.
    return ((scrollY - start) / distance) * 7;
  }, time);
  await settle(expectedTime);
  return expectedTime;
};
for (const [width, height] of [
  [1440, 900],
  [390, 844],
  [390, 650],
  [320, 740],
  [768, 1024],
  [1366, 768],
  [3440, 1440],
]) {
  await page.setViewportSize({ width, height });
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.waitForSelector(".film-ready");
  const times =
    width === 1440 || width === 390
      ? [1.2, 1.65, 2.15, 2.8, 3.6, 4.25, 4.85, 5.35, 5.9, 6.7]
      : [2.8, 6.7];
  for (const t of times) {
    await seek(t);
    const viewportName = height === 650 ? `${width}x${height}` : width;
    await page.screenshot({ path: `qa/film/${viewportName}-${t}.png` });
  }
  await seek(2.4);
  const before = await canvas.evaluate((el) => el.toDataURL());
  const beforeTime = Number(await canvas.getAttribute("data-time"));
  const tinyScroll = await page.evaluate(() => {
    const root = document.querySelector(".experience");
    const start = root.getBoundingClientRect().top + scrollY;
    const previousY = scrollY;
    window.scrollTo({ top: previousY + 1, behavior: "instant" });
    return {
      pixels: scrollY - previousY,
      expectedTime: ((scrollY - start) / (root.offsetHeight - innerHeight)) * 7,
    };
  });
  await settle(tinyScroll.expectedTime);
  const nearby = await canvas.evaluate((el) => el.toDataURL());
  const nearbyTime = Number(await canvas.getAttribute("data-time"));
  await seek(5.5);
  const expectedReverseTime = await seek(2.4);
  const reverse = await canvas.evaluate((el) => el.toDataURL());
  const reverseTime = Number(await canvas.getAttribute("data-time"));
  const beforePixels = await sharp(Buffer.from(before.split(",")[1], "base64"))
    .raw()
    .toBuffer();
  const reversePixels = await sharp(
    Buffer.from(reverse.split(",")[1], "base64"),
  )
    .raw()
    .toBuffer();
  let changedChannels = 0;
  let maxDifference = 0;
  let totalDifference = 0;
  for (let i = 0; i < beforePixels.length; i++) {
    const difference = Math.abs(beforePixels[i] - reversePixels[i]);
    if (difference) changedChannels++;
    maxDifference = Math.max(maxDifference, difference);
    totalDifference += difference;
  }
  const meanDifference = totalDifference / beforePixels.length;
  const reverseTimeDifference = Math.abs(reverseTime - beforeTime);
  const reversePositionError = Math.abs(reverseTime - expectedReverseTime);
  const pausedA = await canvas.evaluate((el) => el.toDataURL());
  await page.waitForTimeout(300);
  const pausedB = await canvas.evaluate((el) => el.toDataURL());
  await seek(5);
  const visibleSceneCopyCount = await page.locator(".film-panel").evaluateAll(
    (panels) =>
      panels.filter((panel) => {
        const style = getComputedStyle(panel);
        return (
          panel.querySelector(".scene-copy") &&
          style.visibility === "visible" &&
          Number(style.opacity) > 0.1
        );
      }).length,
  );
  result.viewports.push({
    width,
    height,
    canvasReady: await canvas.evaluate((el) => el.width > 0),
    noHorizontalOverflow: await page.evaluate(
      () => document.documentElement.scrollWidth === innerWidth,
    ),
    smallScrollChangesPixels:
      tinyScroll.pixels === 1 && before !== nearby && nearbyTime > beforeTime,
    testedScrollPixels: tinyScroll.pixels,
    smallScrollTimeChange: nearbyTime - beforeTime,
    reverseRestoresPixels: meanDifference < 0.1,
    reversePixelDifference: {
      changedChannels,
      maxDifference,
      meanDifference,
      totalChannels: beforePixels.length,
    },
    reverseRestoresPosition:
      reverseTimeDifference < 0.001 && reversePositionError < 0.001,
    reverseTimeDifference,
    reversePositionError,
    stopsWhenScrollStops: pausedA === pausedB,
    noOverlappingSceneCopy: visibleSceneCopyCount <= 1,
    visibleSceneCopyCountAtTime5: visibleSceneCopyCount,
    reverseTime,
  });
  if (width === 1440) {
    await seek(4.85);
    await page.screenshot({ path: "qa/film/melt-final-desktop.png" });
    await page.locator(".scene-navigation button").nth(5).click();
    await page.waitForTimeout(1500);
    const scrollBeforeReload = await page.evaluate(() => scrollY);
    // Let the browser restore its scroll position; do not seek again after reload.
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector(".film-ready:not(.reduced)");
    await page.waitForTimeout(600);
    const restoredFinalScene = await page.evaluate(() => {
      const filmCanvas = document.querySelector(".continuous-film canvas");
      const finalPanel = document.querySelector(".scene-final");
      const style = getComputedStyle(finalPanel);
      return {
        time: Number(filmCanvas.dataset.time),
        finalCopyVisible:
          style.visibility === "visible" && Number(style.opacity) > 0.9,
        activeFinalScene: Boolean(
          document.querySelector(
            '.scene-navigation button:nth-child(6).active[aria-current="step"]',
          ),
        ),
        scrollY,
      };
    });
    result.checks.push({
      name: "reload-at-final-scene-restores-film-and-navigation",
      pass:
        restoredFinalScene.time > 6.6 &&
        restoredFinalScene.finalCopyVisible &&
        restoredFinalScene.activeFinalScene &&
        Math.abs(restoredFinalScene.scrollY - scrollBeforeReload) <= 1,
      scrollBeforeReload,
      restoredFinalScene,
    });
    await page.screenshot({ path: "qa/film/reloaded-final-desktop.png" });
  }
}
// Crossing the short-height fallback boundary must restore freshly painted film.
await page.setViewportSize({ width: 390, height: 650 });
await page.goto(origin, { waitUntil: "networkidle" });
await page.waitForSelector(".film-ready:not(.reduced)");
await seek(6.7);
await page.setViewportSize({ width: 390, height: 600 });
await page.waitForSelector(".experience.reduced");
const shortHeightFallbackVisible =
  (await page
    .locator(".continuous-film")
    .evaluate((el) => getComputedStyle(el).display === "none")) &&
  (await page.locator(".process-panel").evaluateAll((els) =>
    els.every((el) => {
      const style = getComputedStyle(el);
      const visual = getComputedStyle(el.querySelector(".scene-visual"));
      return (
        style.visibility === "visible" &&
        Number(style.opacity) === 1 &&
        visual.display !== "none"
      );
    }),
  ));
await page.setViewportSize({ width: 390, height: 650 });
await page.waitForSelector(".film-ready:not(.reduced)");
await seek(6.7);
const restoredCanvas = await canvas.evaluate((el) => {
  const context = el.getContext("2d");
  const pixels = context.getImageData(0, 0, el.width, el.height).data;
  let brightPixels = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) > 40) brightPixels++;
  }
  return {
    ready: el.parentElement.classList.contains("is-ready"),
    nonEmpty: brightPixels > el.width * el.height * 0.01,
    brightPixelRatio: brightPixels / (el.width * el.height),
    width: el.width,
    height: el.height,
  };
});
result.checks.push({
  name: "height-650-600-650-restores-film",
  pass:
    shortHeightFallbackVisible &&
    restoredCanvas.ready &&
    restoredCanvas.nonEmpty,
  shortHeightFallbackVisible,
  restoredCanvas,
});
await page.emulateMedia({ reducedMotion: "reduce" });
await page.reload({ waitUntil: "networkidle" });
result.checks.push({
  name: "reduced-motion-fallback",
  pass:
    (await page
      .locator(".continuous-film")
      .evaluate((el) => getComputedStyle(el).display === "none")) &&
    (await page
      .locator(".process-panel")
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).visibility === "visible"),
      )),
});
await writeFile("qa/film/report.json", JSON.stringify(result, null, 2));
console.log(result);
await browser.close();
if (
  errors.length ||
  result.viewports.some(
    (v) =>
      !v.canvasReady ||
      !v.reverseRestoresPixels ||
      !v.reverseRestoresPosition ||
      !v.smallScrollChangesPixels ||
      !v.stopsWhenScrollStops ||
      !v.noOverlappingSceneCopy ||
      !v.noHorizontalOverflow,
  ) ||
  result.checks.some((c) => !c.pass)
)
  process.exitCode = 1;
