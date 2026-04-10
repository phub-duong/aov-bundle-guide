---
title: "Volume Discount Display Settings"
description: "Customize the appearance of the Volume Discount widget on your storefront in AOV Bundle."
---

# Volume Discount Display Settings

Customize how the Volume Discount widget looks on your storefront. Go to **AOV.ai Bundle Discounts > Design > Volume Discount** to access these settings.

> **Info:** **Prerequisites:** AOV Bundle installed with at least one Volume Discount offer created.

## Steps

1. **Layout**
   - **Horizontal** — Discount tiers are displayed in a row.
   - **Vertical** — Discount tiers are stacked in a column.

2. **Display style** — Adjust the visual appearance:
   - **Block radius** — Set the corner rounding for tier blocks.
   - **Block thickness** — Adjust the border thickness.
   - **Spacing** — Control the space between tier blocks.

3. **Content labels** — Customize the text shown on each tier. Variables update automatically:
   - Volume table description: `{{discount_value}} OFF`
   - Customize tier titles, subtitles, and badge labels.

4. **Redirect after Add to cart**
   - **Stay on current page** — Customer stays on the product page after adding the bundle.
   - **Cart page** — Customer is redirected to the cart.
   - **Checkout page** — Customer goes straight to checkout.

![Widget layout and content](/.gitbook/assets/volume-display/display-step-1.png)

5. Click **Edit widget** to access detailed design options.

#### Theme setting

This tab controls the **visual style** of the Volume Discount widget.

6. **Color styles** — Choose between:
   - **Basic** — Pick a primary and secondary color. Applied automatically across the widget.
   - **Advanced** — Set colors individually:
     - **General**: Primary text, secondary text, background, border.
     - **Selected background**: Gradient start and end colors for the active tier.
     - **Selected border, checkbox**: Border and checkbox accent color.
     - **Price color**: Color for price display.
     - **Button**: Background and text color.
     - **Badge**: Background and text color for tier badges.
     - **Saving**: Background and text color for saving tags.
7. **Themes** — Choose a preset color theme (Basic, Forest, Ocean Blue, Bloody Mary, Spring, Twilight, Summer, Black Friday, Christmas, and more).
8. **Display options**:
   - **Show checkbox** — Show a checkbox next to each tier.
   - **Show line title** — Display a title line for each tier.
   - **Gradient background** — Apply a gradient to the selected tier.

![Theme settings](/.gitbook/assets/volume-display/display-step-2a.png)

#### Content setting

This tab controls the **text labels** inside the widget.

9. **Widget text labels** — Customize all labels displayed in the volume table:
   - Tier titles, subtitles, badge text.
   - Saving text and discount descriptions.
   - Button text ("Add to cart" or "Grab the deal").
10. **Translations** — Click **Translation**, select a language, and customize each label. Keep variables like `{{discount_value}}` intact.

![Content settings](/.gitbook/assets/volume-display/display-step-2b.png)

11. Look at the **live preview panel on the right** to see your changes in real time. When you are satisfied with the design, click **Save** to apply your settings.

![Preview and save](/.gitbook/assets/volume-display/display-step-3.png)

## What's Next

- [Create a Volume Discount](/docs/offers/create-volume-discount)
- [Customize Widget Appearance](/docs/design/customize-widget)
- [Auto-Fit to Your Store Theme](/docs/design/theme-auto-fit)

---

*Was this article helpful? [Let us know](https://github.com/anthropics/claude-code/issues).*
