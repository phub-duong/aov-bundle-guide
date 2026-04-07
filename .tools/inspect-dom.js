#!/usr/bin/env node
/**
 * Inspect DOM structure of each route to find precise selectors.
 * Usage: node inspect-dom.js <route>
 */
const pw = require('playwright');

const BASE_URL = 'https://admin.shopify.com/store/aovbundle1/apps/aov-bundle-upsell/embed';

async function connect() {
  const browser = await pw.chromium.connectOverCDP('http://localhost:9222');
  const page = browser.contexts()[0].pages()[0];
  return { browser, page };
}

async function getAppFrame(page) {
  const frames = page.frames();
  for (let i = frames.length - 1; i >= 0; i--) {
    const frame = frames[i];
    if (frame === page.mainFrame()) continue;
    const isApp = await frame.evaluate(() => {
      const text = document.body?.innerText || '';
      return text.length > 50;
    }).catch(() => false);
    if (isApp) return frame;
  }
  return frames[frames.length - 1];
}

async function inspectPage(page, route, waitMs = 3000) {
  const url = BASE_URL + route;
  console.log(`\nNavigating to: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(waitMs);

  const frame = await getAppFrame(page);

  const elements = await frame.evaluate(() => {
    const results = [];

    // h2 elements
    document.querySelectorAll('h2').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length < 80) {
        const box = el.getBoundingClientRect();
        results.push({ tag: 'h2', text, x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) });
      }
    });

    // h3 elements
    document.querySelectorAll('h3').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length < 80) {
        const box = el.getBoundingClientRect();
        results.push({ tag: 'h3', text, x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) });
      }
    });

    // label elements
    document.querySelectorAll('label').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length < 80) {
        const box = el.getBoundingClientRect();
        if (box.width > 0) results.push({ tag: 'label', text, x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) });
      }
    });

    // button elements with text
    document.querySelectorAll('button').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length < 60) {
        const box = el.getBoundingClientRect();
        if (box.width > 0 && box.height > 0) results.push({ tag: 'button', text, x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) });
      }
    });

    // p elements with short text (likely section descriptions)
    document.querySelectorAll('p').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length < 80 && text.length > 5) {
        const box = el.getBoundingClientRect();
        if (box.width > 0 && box.y > 0) results.push({ tag: 'p', text: text.substring(0, 60), x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) });
      }
    });

    // span elements that look like section headers (short text in sidebar/nav)
    document.querySelectorAll('span').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length < 40 && text.length > 3) {
        const box = el.getBoundingClientRect();
        if (box.width > 0 && box.width < 300 && box.height > 15 && box.y > 0) {
          results.push({ tag: 'span', text, x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) });
        }
      }
    });

    return results.filter(r => r.y >= 0 && r.y < 2000).sort((a, b) => a.y - b.y);
  });

  // Deduplicate by text+tag
  const seen = new Set();
  const unique = elements.filter(e => {
    const key = `${e.tag}:${e.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\nElements found (${unique.length}):`);
  unique.forEach(e => {
    console.log(`  [${e.tag}] "${e.text}" @ (${e.x},${e.y}) ${e.w}x${e.h}`);
  });

  return unique;
}

async function main() {
  const route = process.argv[2] || '/';
  const waitMs = parseInt(process.argv[3] || '3000');

  const { browser, page } = await connect();
  try {
    await inspectPage(page, route, waitMs);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
