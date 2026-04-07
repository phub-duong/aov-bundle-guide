const pw = require('playwright');
(async () => {
  const browser = await pw.chromium.connectOverCDP('http://localhost:9222');
  const page = browser.contexts()[0].pages().slice(-1)[0];

  for (const frame of page.frames()) {
    const el = await frame.$('.Polaris-TextField__Input').catch(() => null);
    if (el) {
      const box = await el.boundingBox();
      console.log('Input boundingBox:', JSON.stringify(box));

      // Also try text selector
      const labelEl = await frame.$('text=Offer name').catch(() => null);
      if (labelEl) {
        const labelBox = await labelEl.boundingBox();
        console.log('Label boundingBox:', JSON.stringify(labelBox));
      }

      // Try the Offer information heading
      const h2 = await frame.$('h2:has-text("Offer information")').catch(() => null);
      if (h2) {
        const h2Box = await h2.boundingBox();
        console.log('H2 Offer info boundingBox:', JSON.stringify(h2Box));
      }

      // Get the Polaris-TextField wrapper (parent of input)
      const tfEl = await frame.$('.Polaris-TextField').catch(() => null);
      if (tfEl) {
        const tfBox = await tfEl.boundingBox();
        console.log('TextField wrapper boundingBox:', JSON.stringify(tfBox));
      }

      break;
    }
  }
  await browser.close();
})();
