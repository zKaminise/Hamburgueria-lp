import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("qa/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (error) => console.log("PAGE ERROR", error.message));
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE ERROR", msg.text());
});
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await page.screenshot({ path: "qa/screenshots/initial-desktop.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "qa/screenshots/initial-mobile.png" });
console.log(
  await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    images: [...document.images]
      .filter((i) => !i.complete || !i.naturalWidth)
      .map((i) => i.src),
  })),
);
await browser.close();
