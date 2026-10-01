import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.addInitScript(() => {
  window.__layoutShift = 0;
  new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__layoutShift += entry.value; }).observe({ type: 'layout-shift', buffered: true });
});
await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
const loading = await page.evaluate(() => ({
  firstContentfulPaintMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
  initialTransferBytes: performance.getEntriesByType('resource').reduce((total, r) => total + r.transferSize, 0),
  imageTransferBytes: performance.getEntriesByType('resource').filter(r => r.name.includes('/assets/')).reduce((total, r) => total + r.transferSize, 0),
  layoutShift: window.__layoutShift,
}));
const frames = await page.evaluate(() => new Promise(resolve => {
  let first = null, last = null; const deltas = [];
  const distance = document.querySelector('.experience').offsetHeight - innerHeight;
  const frame = now => {
    if (first === null) first = now;
    if (last !== null) deltas.push(now - last);
    last = now;
    window.scrollTo({ top: distance * Math.min((now - first) / 5000, 1), behavior: 'instant' });
    if (now - first < 5000) requestAnimationFrame(frame);
    else { const sorted = deltas.slice().sort((a,b) => a-b); resolve({ frameCount: deltas.length, medianMs: sorted[Math.floor(sorted.length/2)], p95Ms: sorted[Math.floor(sorted.length*.95)], over50Ms: deltas.filter(n => n>50).length }); }
  };
  requestAnimationFrame(frame);
}));
const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
const staticPage = await noJs.newPage();
await staticPage.goto('http://127.0.0.1:3000');
const fallback = await staticPage.locator('.process-panel').evaluateAll(els => els.every(el => getComputedStyle(el).visibility === 'visible' && getComputedStyle(el).position === 'relative'));
const report = { measuredAt: new Date().toISOString(), context: 'Localhost, Chrome headless, 390x844, cache nova; não equivale a Lighthouse nem a um aparelho físico.', loading, frames, noJavaScriptFallback: fallback };
await writeFile('qa/performance.json', JSON.stringify(report, null, 2));
console.log(report);
await browser.close();
