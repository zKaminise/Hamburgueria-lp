import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
await mkdir("qa/film-v2", { recursive: true });
for (const [width, height] of [
  [1440, 900],
  [390, 844],
  [390, 650],
  [768, 1024],
  [320, 740],
]) {
  await page.setViewportSize({ width, height });
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:3001", {
    waitUntil: "networkidle",
  });
  await page.waitForSelector(".film-ready");
  for (const t of width === 1440
    ? [2.4, 3.4, 4.55, 5, 5.5, 6, 6.25, 6.8]
    : [5, 6.8]) {
    await page.evaluate((t) => {
      const el = document.querySelector(".experience");
      scrollTo({
        top: el.offsetTop + ((el.offsetHeight - innerHeight) * t) / 7,
        behavior: "instant",
      });
    }, t);
    await page.waitForTimeout(650);
    await page.screenshot({ path: `qa/film-v2/${width}x${height}-${t}.png` });
  }
}
await browser.close();
