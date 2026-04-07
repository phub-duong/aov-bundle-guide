#!/usr/bin/env node
/**
 * Auto-capture screenshots for all AOV Bundle help articles.
 * Usage: node auto-capture.js [article-slug]
 * If no slug provided, captures all articles.
 */
const pw = require('playwright');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { execSync } = require('child_process');

const BASE_URL = 'https://admin.shopify.com/store/aovbundle1/apps/aov-bundle-upsell/embed';
const IMG_DIR = path.join(__dirname, '..', 'public', 'images');

// Helper: connect to CDP
async function connect() {
  const browser = await pw.chromium.connectOverCDP('http://localhost:9222');
  const page = browser.contexts()[0].pages()[0];
  return { browser, page };
}

// Helper: get app frame (the inner iframe with actual app content)
async function getAppFrame(page) {
  const frames = page.frames();
  // Last frame is usually the app frame
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

// Helper: navigate to app route
async function navigateTo(page, route) {
  const url = BASE_URL + (route.startsWith('/') ? route : '/' + route);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
}

// Helper: navigate within SPA (click sidebar link by text)
async function navigateInSPA(frame, linkText) {
  await frame.evaluate((text) => {
    const links = [...document.querySelectorAll('a, [role="link"]')];
    const link = links.find(a => a.textContent?.trim() === text);
    if (link) link.click();
  }, linkText);
  await new Promise(r => setTimeout(r, 2000));
}

// Helper: take annotated screenshot using annotate.js
// step can be a string selector or an object with { selector, parentDepth, ... }
async function annotate(outputPath, step, stepNumber, totalSteps) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const selector = typeof step === 'string' ? step : step.selector;
  const parentDepth = typeof step === 'object' ? (step.parentDepth || 0) : 0;

  const annotation = {
    selector,
    stepNumber,
    totalSteps,
    position: 'auto',
    ...(parentDepth > 0 ? { parentDepth } : {}),
  };

  try {
    execSync(
      `node ${path.join(__dirname, 'annotate.js')} "${outputPath}" '${JSON.stringify(annotation)}' '{"imageRadius":16}'`,
      { cwd: __dirname, timeout: 20000, encoding: 'utf-8' }
    );
    console.log(`  ✓ Step ${stepNumber}: annotated ${selector.substring(0, 50)}`);
    return true;
  } catch (e) {
    console.log(`  ✗ Step ${stepNumber}: failed "${selector}" - ${e.message?.substring(0, 100)}`);
    return false;
  }
}

// Helper: take plain screenshot with gradient bg
async function plainScreenshot(page, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const tmpPath = '/tmp/temp-auto-capture.png';
  await page.screenshot({ path: tmpPath });

  const meta = await sharp(tmpPath).metadata();
  const padding = 60, radius = 16;
  const w = meta.width + padding * 2, h = meta.height + padding * 2;

  const bg = Buffer.from(`<svg width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e8f4f8"/><stop offset="100%" stop-color="#d4e4f7"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`);
  const mask = Buffer.from(`<svg width="${meta.width}" height="${meta.height}"><rect width="${meta.width}" height="${meta.height}" rx="${radius}" ry="${radius}" fill="white"/></svg>`);
  const rounded = await sharp(tmpPath).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  await sharp(bg).composite([{ input: rounded, left: padding, top: padding }]).toFile(outputPath);

  console.log(`  ✓ Plain screenshot saved`);
}

// ============ ARTICLE DEFINITIONS ============
// Each step: { type: 'annotate'|'plain', selector, parentDepth, fallback, desc }
// annotate.js handles scrollIntoView automatically — no need to specify scroll offsets

const articles = {

  // ── GETTING STARTED ────────────────────────────────────────────────────────

  'dashboard-overview': {
    route: '/',
    steps: [
      { type: 'plain', desc: 'Dashboard overview' },
      { type: 'annotate', selector: 'text=Offer', fallback: 'a:has-text("Offer")', parentDepth: 1, desc: 'Offer nav link' },
      { type: 'annotate', selector: 'text=Analytics', fallback: 'a:has-text("Analytics")', parentDepth: 1, desc: 'Analytics nav link' },
      { type: 'annotate', selector: 'text=Widget display', fallback: 'text=Widget', parentDepth: 1, desc: 'Widget display link' },
    ]
  },

  'quick-start': {
    route: '/offers',
    steps: [
      { type: 'annotate', selector: 'button:has-text("Create new offer")', desc: 'Create new offer button' },
      { type: 'annotate', selector: 'button[role="tab"]:has-text("Volume Discount")', parentDepth: 2, desc: 'Volume Discount offer type' },
      { type: 'annotate', selector: 'button[role="tab"]:has-text("Frequently bought together")', parentDepth: 2, desc: 'FBT offer type' },
      { type: 'annotate', selector: 'button[role="tab"]:has-text("Bundle builder")', parentDepth: 2, desc: 'Bundle Builder offer type' },
    ]
  },

  'install-app': {
    route: '/',
    steps: [
      { type: 'plain', desc: 'App dashboard after install' },
      { type: 'annotate', selector: 'text=Offer', fallback: 'a:has-text("Offer")', parentDepth: 1, desc: 'Navigate to Offers' },
    ]
  },

  // ── OFFERS ─────────────────────────────────────────────────────────────────

  'offers-overview': {
    route: '/offers',
    steps: [
      { type: 'plain', desc: 'Offer list overview' },
      { type: 'annotate', selector: 'button[role="tab"]:has-text("Volume Discount")', parentDepth: 2, desc: 'Volume Discount tab' },
      { type: 'annotate', selector: 'button[role="tab"]:has-text("Frequently bought together")', parentDepth: 2, desc: 'FBT tab' },
      { type: 'annotate', selector: 'button[role="tab"]:has-text("Bundle builder")', parentDepth: 2, desc: 'Bundle Builder tab' },
      { type: 'annotate', selector: 'button[role="tab"]:has-text("Mix match bundle")', parentDepth: 2, desc: 'Mix Match tab' },
    ]
  },

  'create-volume-discount': {
    route: '/offers',
    steps: [
      { type: 'annotate', selector: 'button:has-text("Create new offer")', desc: 'Create new offer button' },
      // Navigate to form for remaining steps
    ],
    extraSteps: {
      route: '/offers/create/volume-discount',
      steps: [
        { type: 'annotate', selector: 'h2:has-text("Offer name")', parentDepth: 1, desc: 'Offer name field', stepOffset: 1 },
        { type: 'annotate', selector: 'h2:has-text("Trigger condition")', parentDepth: 2, desc: 'Trigger conditions', stepOffset: 2 },
        { type: 'annotate', selector: 'label:has-text("Discount type")', parentDepth: 3, desc: 'Discount type', stepOffset: 3 },
        { type: 'annotate', selector: 'button:has-text("+ Add tier")', parentDepth: 4, desc: 'Discount tiers', stepOffset: 4 },
        { type: 'annotate', selector: 'p:has-text("Attach a gift")', parentDepth: 2, desc: 'Add gift', stepOffset: 5 },
        { type: 'annotate', selector: 'p:has-text("Step 2: Display setting")', parentDepth: 2, desc: 'Display setting tab', stepOffset: 6 },
      ]
    }
  },

  'create-fbt': {
    route: '/offers/create/fbt',
    steps: [
      { type: 'annotate', selector: 'h2:has-text("Offer name")', fallback: 'label:has-text("Offer name")', parentDepth: 1, desc: 'Offer name field' },
      { type: 'annotate', selector: 'h2:has-text("Trigger condition")', fallback: 'text=Trigger condition', parentDepth: 2, desc: 'Trigger conditions' },
      { type: 'annotate', selector: 'h2:has-text("Add Offer")', fallback: 'text=Add Offer product', parentDepth: 2, desc: 'Add Offer products' },
      { type: 'annotate', selector: 'label:has-text("Discount type")', fallback: 'text=Discount', parentDepth: 3, desc: 'Discount settings' },
      { type: 'annotate', selector: 'p:has-text("Step 2: Display setting")', parentDepth: 2, desc: 'Display setting tab' },
    ],
    prependStep: { type: 'annotate', selector: 'button:has-text("Create new offer")', desc: 'Create new offer', route: '/offers' }
  },

  'create-bundle-builder': {
    route: '/offers/create/bundle-builder',
    steps: [
      { type: 'annotate', selector: 'h2:has-text("Offer name")', fallback: 'label:has-text("Offer name")', parentDepth: 1, desc: 'Offer name' },
      { type: 'annotate', selector: 'h2:has-text("Trigger condition")', fallback: 'text=Layout', parentDepth: 2, desc: 'Layout type' },
      { type: 'annotate', selector: 'text=Category', fallback: 'text=category', parentDepth: 2, desc: 'Categories' },
      { type: 'annotate', selector: 'label:has-text("Discount type")', fallback: 'text=Discount', parentDepth: 3, desc: 'Discount settings' },
      { type: 'annotate', selector: 'p:has-text("Step 2: Display setting")', parentDepth: 2, desc: 'Display setting tab' },
    ],
    prependStep: { type: 'annotate', selector: 'button:has-text("Create new offer")', desc: 'Create new offer', route: '/offers' }
  },

  'create-product-fixed-bundle': {
    route: '/offers/create/product-fixed-bundle',
    steps: [
      { type: 'annotate', selector: 'h2:has-text("Offer Information")', fallback: 'label:has-text("Offer name")', parentDepth: 1, desc: 'Offer title' },
      { type: 'annotate', selector: 'h2:has-text("Product Display")', fallback: 'text=Product Display', parentDepth: 2, desc: 'Product selection' },
      { type: 'annotate', selector: 'h2:has-text("Applicable Product")', fallback: 'text=Applicable', parentDepth: 2, desc: 'Applicable products' },
      { type: 'annotate', selector: 'h2:has-text("Offer Details")', fallback: 'text=Discount method', parentDepth: 2, desc: 'Pricing config' },
      { type: 'annotate', selector: 'text=Bundle Status', fallback: 'text=Status', parentDepth: 2, desc: 'Bundle status' },
      { type: 'annotate', selector: 'button:has-text("Save")', fallback: 'text=Save', desc: 'Save button' },
    ],
    prependStep: { type: 'annotate', selector: 'button:has-text("Create new offer")', desc: 'Create new offer', route: '/offers' }
  },

  'create-mix-match': {
    route: '/offers/create/mix-match-bundle',
    steps: [
      { type: 'annotate', selector: 'h2:has-text("Offer Information")', fallback: 'label:has-text("Offer name")', parentDepth: 1, desc: 'Offer title' },
      { type: 'annotate', selector: 'h2:has-text("Bundle Option")', fallback: 'text=Bundle option', parentDepth: 2, desc: 'Bundle options' },
      { type: 'annotate', selector: 'label:has-text("Discount type")', fallback: 'text=Discount', parentDepth: 3, desc: 'Discount settings' },
      { type: 'annotate', selector: 'h2:has-text("Widget Content")', fallback: 'text=Widget Content', parentDepth: 2, desc: 'Widget content' },
      { type: 'annotate', selector: 'text=Bundle Status', fallback: 'text=Status', parentDepth: 2, desc: 'Bundle status' },
      { type: 'annotate', selector: 'button:has-text("Save")', fallback: 'text=Save', desc: 'Save button' },
    ],
    prependStep: { type: 'annotate', selector: 'button:has-text("Create new offer")', desc: 'Create new offer', route: '/offers' }
  },

  'manage-offers': {
    route: '/offers',
    steps: [
      { type: 'annotate', selector: 'button:has-text("Create new offer")', desc: 'Create new offer button' },
      { type: 'annotate', selector: 'button[role="tab"]:has-text("All")', parentDepth: 2, desc: 'Status filter tabs' },
      { type: 'annotate', selector: 'text=Offer name', parentDepth: 1, desc: 'Offer table' },
      { type: 'plain', desc: 'Actions column' },
    ]
  },

  'offer-triggers': {
    route: '/offers',
    steps: [
      { type: 'plain', desc: 'Offers page — step 1' },
    ],
    extraSteps: {
      route: '/offers/edit/1617545101528',
      extraWaitMs: 6000,
      steps: [
        { type: 'annotate', selector: 'h2:has-text("Customer meets condition")', parentDepth: 2, desc: 'Trigger conditions section', stepOffset: 1 },
        { type: 'annotate', selector: 'label:has-text("This offer is applicable to products")', parentDepth: 3, desc: 'Trigger type label', stepOffset: 2 },
        { type: 'annotate', selector: 'h2:has-text("Customer meets condition")', parentDepth: 2, desc: 'Products selected', stepOffset: 3 },
        { type: 'annotate', selector: 'h2:has-text("Discount settings")', parentDepth: 2, desc: 'Discount settings', stepOffset: 4 },
        { type: 'annotate', selector: 'button:has-text("Save")', fallback: 'text=Save', desc: 'Save button', stepOffset: 5 },
      ]
    }
  },

  // ── DESIGN ─────────────────────────────────────────────────────────────────

  'design-overview': {
    route: '/design',
    steps: [
      { type: 'plain', desc: 'Design page overview' },
      { type: 'annotate', selector: 'text=Volume Table', fallback: 'text=Volume', parentDepth: 2, desc: 'Volume Table design type' },
      { type: 'annotate', selector: 'text=Frequently Bought Together', fallback: 'text=FBT', parentDepth: 2, desc: 'FBT design type' },
    ]
  },

  'customize-widget': {
    route: '/design',
    steps: [
      { type: 'plain', desc: 'Design page' },
      { type: 'annotate', selector: 'text=Volume Table', fallback: 'text=Edit', parentDepth: 2, desc: 'Widget type selection' },
      { type: 'annotate', selector: 'text=Color', fallback: 'text=color', parentDepth: 2, desc: 'Color settings' },
      { type: 'annotate', selector: 'text=Typography', fallback: 'text=font', parentDepth: 2, desc: 'Typography' },
    ]
  },

  'theme-auto-fit': {
    route: '/design',
    steps: [
      { type: 'plain', desc: 'Design page' },
      { type: 'annotate', selector: 'text=Theme', fallback: 'text=theme', parentDepth: 2, desc: 'Theme section' },
      { type: 'annotate', selector: 'text=Auto', fallback: 'text=auto', parentDepth: 2, desc: 'Auto fit option' },
    ]
  },

  // ── ANALYTICS ──────────────────────────────────────────────────────────────

  'analytics-overview': {
    route: '/analytics',
    steps: [
      { type: 'plain', desc: 'Analytics page overview' },
      { type: 'annotate', selector: 'text=Revenue', fallback: 'text=revenue', parentDepth: 2, desc: 'Revenue metrics' },
      { type: 'annotate', selector: 'text=Conversion', fallback: 'text=conversion', parentDepth: 2, desc: 'Conversion metrics' },
      { type: 'annotate', selector: 'text=All Offers', fallback: 'text=Campaign', parentDepth: 2, desc: 'Offer filter' },
    ]
  },

  'offer-performance': {
    route: '/analytics',
    steps: [
      { type: 'plain', desc: 'Analytics page' },
      { type: 'annotate', selector: 'text=Revenue', fallback: 'text=revenue', parentDepth: 2, desc: 'Revenue data' },
      { type: 'annotate', selector: 'text=Conversion', fallback: 'text=conversion', parentDepth: 2, desc: 'Conversion rate' },
    ]
  },

  // ── SETTINGS ───────────────────────────────────────────────────────────────

  'app-settings': {
    route: '/settings',
    steps: [
      { type: 'plain', desc: 'Settings page overview' },
      { type: 'annotate', selector: 'text=General', fallback: 'text=general', parentDepth: 2, desc: 'General settings' },
      { type: 'annotate', selector: 'text=Language', fallback: 'text=language', parentDepth: 2, desc: 'Language settings' },
      { type: 'annotate', selector: 'button:has-text("Save")', fallback: 'text=Save', desc: 'Save settings' },
    ]
  },

  'manage-subscription': {
    route: '/subscription',
    steps: [
      { type: 'plain', desc: 'Subscription page' },
      { type: 'annotate', selector: 'text=Plan', fallback: 'text=plan', parentDepth: 2, desc: 'Current plan' },
      { type: 'annotate', selector: 'text=Upgrade', fallback: 'text=upgrade', parentDepth: 2, desc: 'Upgrade option' },
    ]
  },
};

// ============ CAPTURE FUNCTIONS ============

async function captureArticle(slug, config) {
  console.log(`\n📸 Capturing: ${slug}`);

  // Handle prependStep (capture one step from a different route first)
  if (config.prependStep) {
    const { browser: b1, page: p1 } = await connect();
    await navigateTo(p1, config.prependStep.route || '/offers');
    const outDir = path.join(IMG_DIR, slug);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const ok = await annotate(path.join(outDir, 'step-1.png'), config.prependStep, 1, config.steps.length + 1);
    if (!ok) await plainScreenshot(p1, path.join(outDir, 'step-1.png'));
    await b1.close();
  }

  // Main route capture
  const { browser, page } = await connect();
  await navigateTo(page, config.route);

  const outDir = path.join(IMG_DIR, slug);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const stepOffset = config.prependStep ? 1 : 0;
  const totalSteps = config.steps.length + stepOffset;

  for (let i = 0; i < config.steps.length; i++) {
    const step = config.steps[i];
    const stepNum = i + 1 + stepOffset;
    const outPath = path.join(outDir, `step-${stepNum}.png`);

    if (step.type === 'plain') {
      await plainScreenshot(page, outPath);
      console.log(`  ✓ Step ${stepNum}: plain screenshot`);
    } else {
      let ok = await annotate(outPath, step, stepNum, totalSteps);
      if (!ok && step.fallback) {
        ok = await annotate(outPath, { selector: step.fallback, parentDepth: step.parentDepth }, stepNum, totalSteps);
      }
      if (!ok) {
        await plainScreenshot(page, outPath);
        console.log(`  ⚠ Step ${stepNum}: fell back to plain`);
      }
    }
  }

  // Handle extraSteps (additional steps from a different route)
  if (config.extraSteps) {
    const extraOffset = stepOffset + config.steps.length;
    const extraTotal = extraOffset + config.extraSteps.steps.length;
    await navigateTo(page, config.extraSteps.route);
    if (config.extraSteps.extraWaitMs) await page.waitForTimeout(config.extraSteps.extraWaitMs);
    for (let i = 0; i < config.extraSteps.steps.length; i++) {
      const step = config.extraSteps.steps[i];
      const stepNum = i + 1 + extraOffset;
      const outPath = path.join(outDir, `step-${stepNum}.png`);
      if (step.type === 'plain') {
        await plainScreenshot(page, outPath);
        console.log(`  ✓ Step ${stepNum}: plain screenshot`);
      } else {
        let ok = await annotate(outPath, step, stepNum, extraTotal);
        if (!ok && step.fallback) {
          ok = await annotate(outPath, { selector: step.fallback, parentDepth: step.parentDepth }, stepNum, extraTotal);
        }
        if (!ok) {
          await plainScreenshot(page, outPath);
          console.log(`  ⚠ Step ${stepNum}: fell back to plain`);
        }
      }
    }
  }

  await browser.close();
  console.log(`✅ Done: ${slug}`);
}

async function main() {
  const targetSlug = process.argv[2];

  // Skip create-volume-discount (already done manually)
  const skipSlugs = new Set(['create-volume-discount']);

  if (targetSlug) {
    if (!articles[targetSlug]) {
      console.error(`Unknown article: ${targetSlug}`);
      console.log('Available:', Object.keys(articles).join(', '));
      process.exit(1);
    }
    await captureArticle(targetSlug, articles[targetSlug]);
  } else {
    for (const [slug, config] of Object.entries(articles)) {
      if (skipSlugs.has(slug)) {
        console.log(`\nSkipping ${slug} (already captured)`);
        continue;
      }
      try {
        await captureArticle(slug, config);
      } catch (e) {
        console.error(`❌ Error capturing ${slug}: ${e.message}`);
      }
    }
  }

  console.log('\n🎉 All captures complete!');
}

main().catch(console.error);
