const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CDP_URL = 'http://localhost:9222';
const RED = '#E8364F';

// ── Reuse annotate.js helpers ──

function jitter(val, amount) { return val + (Math.random() - 0.5) * amount * 2; }

function sketchyRect(box, opts = {}) {
  const pad = opts.padding || 5;
  const x = box.x - pad, y = box.y - pad;
  const w = box.width + pad * 2, h = box.height + pad * 2;
  const r = opts.borderRadius || 6;
  const sw = opts.strokeWidth || 2;
  const j = 1.2;
  const pathFn = (seed) => {
    const rng = (v, s) => v + Math.sin(s * 7.3 + v * 0.1) * j;
    return `M ${rng(x+r,seed)},${rng(y,seed)} L ${rng(x+w-r,seed+1)},${rng(y,seed+1)} Q ${rng(x+w,seed+2)},${rng(y,seed+2)} ${rng(x+w,seed+3)},${rng(y+r,seed+3)} L ${rng(x+w,seed+4)},${rng(y+h-r,seed+4)} Q ${rng(x+w,seed+5)},${rng(y+h,seed+5)} ${rng(x+w-r,seed+6)},${rng(y+h,seed+6)} L ${rng(x+r,seed+7)},${rng(y+h,seed+7)} Q ${rng(x,seed+8)},${rng(y+h,seed+8)} ${rng(x,seed+9)},${rng(y+h-r,seed+9)} L ${rng(x,seed+10)},${rng(y+r,seed+10)} Q ${rng(x,seed+11)},${rng(y,seed+11)} ${rng(x+r,seed+12)},${rng(y,seed+12)} Z`;
  };
  return `<path d="${pathFn(0)}" fill="none" stroke="${RED}" stroke-width="${sw}" opacity="0.35"/>
    <path d="${pathFn(3.7)}" fill="none" stroke="${RED}" stroke-width="${sw}" opacity="0.8"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${RED}" opacity="0.06"/>`;
}

function sketchyArrow(fromX, fromY, toX, toY) {
  const sw = 3;
  const dx = toX - fromX, dy = toY - fromY;
  const len = Math.sqrt(dx*dx + dy*dy);
  const perpX = -dy/len, perpY = dx/len;
  const curveAmount = len * 0.15 * (Math.random() > 0.5 ? 1 : -1);
  const cx = (fromX+toX)/2 + perpX*curveAmount;
  const cy = (fromY+toY)/2 + perpY*curveAmount;
  const angle = Math.atan2(toY-cy, toX-cx);
  const headLen = 12, spread = Math.PI/5;
  const a1x = toX - headLen*Math.cos(angle-spread) + (Math.random()-0.5)*2;
  const a1y = toY - headLen*Math.sin(angle-spread) + (Math.random()-0.5)*2;
  const a2x = toX - headLen*Math.cos(angle+spread) + (Math.random()-0.5)*2;
  const a2y = toY - headLen*Math.sin(angle+spread) + (Math.random()-0.5)*2;
  return `<path d="M ${fromX},${fromY} Q ${cx},${cy} ${toX},${toY}" fill="none" stroke="${RED}" stroke-width="${sw}" stroke-linecap="round" opacity="0.85"/>
    <line x1="${toX}" y1="${toY}" x2="${a1x}" y2="${a1y}" stroke="${RED}" stroke-width="${sw}" stroke-linecap="round" opacity="0.85"/>
    <line x1="${toX}" y1="${toY}" x2="${a2x}" y2="${a2y}" stroke="${RED}" stroke-width="${sw}" stroke-linecap="round" opacity="0.85"/>`;
}

function stepBadge(x, y, num) {
  const r = 14, rot = (Math.random()-0.5)*2;
  return `<g transform="rotate(${rot},${x},${y})"><circle cx="${x}" cy="${y}" r="${r+2}" fill="white" opacity="0.95"/><circle cx="${x}" cy="${y}" r="${r}" fill="${RED}" opacity="0.9"/><text x="${x}" y="${y}" dy="0.35em" text-anchor="middle" fill="white" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="15px">${num}</text></g>`;
}

function autoPick(box, imgW, imgH) {
  const st = box.y, sb = imgH-(box.y+box.height), sl = box.x, sr = imgW-(box.x+box.width);
  const m = Math.max(st,sb,sl,sr);
  if (m===st && sr>100) return 'top-right'; if (m===st) return 'top';
  if (m===sb && sr>100) return 'bottom-right'; if (m===sb) return 'bottom';
  if (m===sr) return 'right'; return 'left';
}

function placeArrow(box, pos, imgW, imgH) {
  const pad=8, arrowLen=60, cx=box.x+box.width/2, cy=box.y+box.height/2;
  let af, at;
  switch(pos) {
    case 'top-right': at={x:box.x+box.width+pad,y:box.y-pad}; af={x:at.x+arrowLen,y:at.y-arrowLen}; break;
    case 'top-left': at={x:box.x-pad,y:box.y-pad}; af={x:at.x-arrowLen,y:at.y-arrowLen}; break;
    case 'bottom-right': at={x:box.x+box.width+pad,y:box.y+box.height+pad}; af={x:at.x+arrowLen,y:at.y+arrowLen}; break;
    case 'bottom-left': at={x:box.x-pad,y:box.y+box.height+pad}; af={x:at.x-arrowLen,y:at.y-arrowLen}; break;
    case 'left': at={x:box.x-pad,y:cy}; af={x:at.x-arrowLen-20,y:cy-15}; break;
    case 'right': at={x:box.x+box.width+pad,y:cy}; af={x:at.x+arrowLen+20,y:cy-15}; break;
    case 'bottom': at={x:cx,y:box.y+box.height+pad}; af={x:cx+30,y:at.y+arrowLen}; break;
    default: at={x:cx,y:box.y-pad}; af={x:cx+30,y:at.y-arrowLen}; break;
  }
  af.x = Math.max(15, Math.min(af.x, imgW-15));
  af.y = Math.max(15, Math.min(af.y, imgH-15));
  return { af, at };
}

async function generateGradientBg(w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="base" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0055CC"/><stop offset="50%" stop-color="#0022AA"/><stop offset="100%" stop-color="#1a0066"/></linearGradient><radialGradient id="cyan" cx="0%" cy="0%" r="60%"><stop offset="0%" stop-color="#00BFFF" stop-opacity="0.8"/><stop offset="100%" stop-color="#0022AA" stop-opacity="0"/></radialGradient><radialGradient id="purple" cx="85%" cy="40%" r="50%"><stop offset="0%" stop-color="#7744CC" stop-opacity="0.7"/><stop offset="100%" stop-color="#0022AA" stop-opacity="0"/></radialGradient><radialGradient id="amber" cx="95%" cy="95%" r="45%"><stop offset="0%" stop-color="#DDAA55" stop-opacity="0.8"/><stop offset="100%" stop-color="#0022AA" stop-opacity="0"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#base)"/><rect width="${w}" height="${h}" fill="url(#cyan)"/><rect width="${w}" height="${h}" fill="url(#purple)"/><rect width="${w}" height="${h}" fill="url(#amber)"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function addBg(imgBuf, opts={}) {
  const { width, height } = await sharp(imgBuf).metadata();
  const px=opts.paddingX||60, py=opts.paddingY||50, r=opts.imageRadius||16;
  const tw=width+px*2, th=height+py*2;
  const bg = await generateGradientBg(tw, th);
  const mask = Buffer.from(`<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${r}" ry="${r}" fill="white"/></svg>`);
  const rounded = await sharp(imgBuf).composite([{input:await sharp(mask).png().toBuffer(), blend:'dest-in'}]).png().toBuffer();
  const shadow = Buffer.from(`<svg width="${tw}" height="${th}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="18" flood-color="rgba(0,0,0,0.35)"/></filter></defs><rect x="${px}" y="${py}" width="${width}" height="${height}" rx="${r}" ry="${r}" fill="white" fill-opacity="0.12" filter="url(#s)"/></svg>`);
  return sharp(bg).composite([{input:await sharp(shadow).png().toBuffer(),top:0,left:0},{input:rounded,top:py,left:px}]).png().toBuffer();
}

// ── Main batch capture ──

async function main() {
  const tasksFile = process.argv[2];
  if (!tasksFile) { console.log('Usage: node batch-capture.js tasks.json'); process.exit(1); }
  const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));

  const browser = await chromium.connectOverCDP(CDP_URL);
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages[pages.length - 1];

  let currentUrl = '';
  const results = [];

  for (const task of tasks) {
    try {
      // Navigate if needed
      if (task.navigate && task.navigate !== currentUrl) {
        // Click sidebar navigation
        const navClick = task.navigate;
        let clicked = false;
        for (const frame of page.frames()) {
          const navEl = await frame.waitForSelector(navClick, { timeout: 3000 }).catch(() => null);
          if (navEl) { await navEl.click(); await page.waitForTimeout(2000); clicked = true; break; }
        }
        if (!clicked) {
          const navEl2 = await page.waitForSelector(navClick, { timeout: 3000 }).catch(() => null);
          if (navEl2) { await navEl2.click(); await page.waitForTimeout(2000); }
        }
        currentUrl = navClick;
      }

      // Ensure output dir
      const dir = path.dirname(task.output);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      if (task.type === 'plain') {
        // Plain screenshot with gradient bg
        const buf = await page.screenshot({ fullPage: false });
        const result = await addBg(buf, { imageRadius: 16, paddingX: 60 });
        await sharp(result).toFile(task.output);
        results.push({ output: task.output, type: 'PLAIN', ok: true });
      } else if (task.type === 'annotate' && task.selector) {
        // Annotated screenshot
        const buf = await page.screenshot({ fullPage: false });
        const { width, height } = await sharp(buf).metadata();

        let el = null;
        for (const frame of page.frames()) {
          el = await frame.waitForSelector(task.selector, { timeout: 3000 }).catch(() => null);
          if (el) break;
        }
        if (!el) { el = await page.waitForSelector(task.selector, { timeout: 2000 }).catch(() => null); }

        if (!el) {
          // Fallback to plain
          const result = await addBg(buf, { imageRadius: 16, paddingX: 60 });
          await sharp(result).toFile(task.output);
          results.push({ output: task.output, type: 'PLAIN (selector not found)', ok: true });
          continue;
        }

        const box = await el.boundingBox();
        if (!box) {
          const result = await addBg(buf, { imageRadius: 16, paddingX: 60 });
          await sharp(result).toFile(task.output);
          results.push({ output: task.output, type: 'PLAIN (no bounding box)', ok: true });
          continue;
        }

        const pos = autoPick(box, width, height);
        const { af, at } = placeArrow(box, pos, width, height);
        const totalSteps = task.totalSteps || 1;
        const stepNum = task.stepNumber || 1;

        const svgParts = [
          sketchyRect(box),
          sketchyArrow(af.x, af.y, at.x, at.y),
          totalSteps > 1 ? stepBadge(af.x, af.y, stepNum) : ''
        ];
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${svgParts.join('\n')}</svg>`;

        let result = await sharp(buf).composite([{input:Buffer.from(svg),top:0,left:0}]).png().toBuffer();
        result = await addBg(result, { imageRadius: 16, paddingX: 60 });
        await sharp(result).toFile(task.output);
        results.push({ output: task.output, type: 'ANNOTATED', ok: true, selector: task.selector });
      }
    } catch (e) {
      results.push({ output: task.output, type: 'FAILED', ok: false, error: e.message });
    }
  }

  // Report
  let annotated = 0, plain = 0, failed = 0;
  for (const r of results) {
    const status = r.ok ? (r.type.startsWith('ANNOTATED') ? '✓ ANNOTATED' : '✓ PLAIN') : '✗ FAILED';
    if (r.type.startsWith('ANNOTATED')) annotated++;
    else if (r.ok) plain++;
    else failed++;
    console.log(`  ${status} -> ${r.output}`);
  }
  console.log(`\nTotal: ${results.length} | Annotated: ${annotated} | Plain: ${plain} | Failed: ${failed}`);
  process.exit(0);
}

main().catch(e => { console.error(e.message); process.exit(1); });
