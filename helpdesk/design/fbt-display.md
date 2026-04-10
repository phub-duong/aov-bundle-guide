---
title: "FBT Display Settings"
description: "Customize the appearance of the Frequently Bought Together widget on your storefront in AOV Bundle."
---

# FBT Display Settings

Customize how the Frequently Bought Together widget looks on your storefront. Go to **AOV.ai Bundle Discounts > Design > Frequently Bought Together** to access these settings.

> **Info:** **Prerequisites:** AOV Bundle installed with at least one FBT offer created.

## Steps

1. **Select layout widget**
   - **Stacked Bundle** — Products are displayed side by side in a horizontal row.
   - **Classic List** — Products are stacked vertically in a list format.
   - **Card Slider** — Products appear in a swipeable card slider.

> **Info:** Stacked Bundle works great for desktop shoppers, while Classic List fits better on mobile screens.

2. **Edit content text**
   - **Title**: The main headline above the widget.
   - **Description**: A short explanation displayed under the title.
   - **Saving**: The text showing how much the customer saves. Use the `{{discounted_amount}}` variable.
   - **Translation**: Click **Translation** to add text in other languages. Keep variables like `{{discounted_amount}}` intact.

3. **Redirect after Add to cart**
   - **Stay on current page** — Customer stays on the product page after adding the bundle.
   - **Cart page** — Customer is redirected to the cart.
   - **Checkout page** — Customer goes straight to checkout.

![Widget content settings](/.gitbook/assets/fbt-display/display-step-1.png)

4. To adjust the widget design and text labels, click **Edit widget** at the top of the Display settings section.

#### Theme setting

This tab controls the **visual style** of the Frequently Bought Together widget.

5. **Color styles** — Choose between:
   - **Basic** — Pick a primary and secondary color. The app applies them across the widget automatically.
   - **Advanced** — Set colors individually for each element: background, text, border, button, badge, and saving tag.
6. **Themes** — Choose a preset color theme (Basic, Forest, Ocean Blue, Bloody Mary, Spring, Twilight, Summer, Black Friday, Christmas, and more).
7. **Display options** — Toggle:
   - **Show checkbox** — Show a checkbox next to each product.
   - **Show line title** — Display a title for each product row.
   - **Gradient background** — Enable a gradient effect on the selected tier background.

![Theme settings](/.gitbook/assets/fbt-display/display-step-2a.png)

#### Content setting

This tab controls the **text and wording** inside the widget.

8. **Widget text labels** — Customize labels such as:
   - **Total for items label**: `Total for {{total_items}} items`
   - **Save label**: `Save {{discounted_amount}}`
   - **'Free' text**: Displayed when an item is free.
   - **'Add to cart' button**: The button text.
9. **Translations** — Click **Translation**, select a language, and translate each label. Keep variables like `{{total_items}}` intact.

![Content settings](/.gitbook/assets/fbt-display/display-step-2b.png)

10. Look at the **live preview panel on the right** to see your changes in real time. When you are satisfied with the design, click **Save** to apply your settings.

![Preview and save](/.gitbook/assets/fbt-display/display-step-3.png)

## What's Next

- [Create an FBT Offer](/docs/offers/create-fbt)
- [Customize Widget Appearance](/docs/design/customize-widget)
- [Auto-Fit to Your Store Theme](/docs/design/theme-auto-fit)

---

*Was this article helpful? [Let us know](https://github.com/anthropics/claude-code/issues).*
