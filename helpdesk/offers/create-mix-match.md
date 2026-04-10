---
title: "Create a Mix-and-Match Bundle"
description: "Step-by-step guide to creating a mix-and-match bundle where customers pick from multiple options in AOV Bundle."
---

# Create a Mix-and-Match Bundle

Mix-and-Match Bundle allows customers to create their own bundle by selecting products from predefined options. Each option represents a choice the customer makes, and a discount is applied once they complete their selections. The widget is displayed on a dedicated bundle page.

> **Info:** **Prerequisites:** AOV Bundle installed and active. Products must already be added to your Shopify store. You need to integrate the widget into your theme to display the bundle page.

## Why Mix-and-Match Bundle?

- **Customer freedom of choice** — Let customers pick exactly what they want from your curated product options, leading to higher satisfaction and fewer returns.
- **Simplified bundle creation** — Define options once, and the app handles all the product combination logic and discount calculations automatically.
- **Flexible discount structures** — Support percentage, fixed amount, and fixed price discounts to match any promotional strategy.

## Steps

1. Go to **AOV.ai Bundle Discounts > Offers**.
2. Click **Create offer**.
3. Select **Mix-and-match bundle** from the offer type list.
4. Click **Create** to proceed.

![Select Mix-and-Match Bundle offer type](/.gitbook/assets/create-mix-match/step-1.png)

5. In the **Bundle option** section, you will see **Bundle option 1** by default.
6. For each bundle option, configure:
   - **Option name** — Enter a descriptive name (e.g., "Choose your top", "Pick a color").
   - **Products** — Click **Browse** to select the products available for this option.
   - Set the quantity for each option.
7. Click **Add bundle option** to create additional options.
8. Use **Duplicate** to copy an existing option, or **Delete** to remove one.

> **Info:** Each option represents one selection the customer makes. For example, a "Build Your Outfit" bundle might have options for Top, Bottom, and Accessory.

![Configure bundle options](/.gitbook/assets/create-mix-match/step-2.png)

9. In the **Discount settings** section, select a **Discount type**:
   - **Percentage** — Discount a percentage off the total (e.g., 15% off).
   - **Fixed amount** — Discount a specific dollar amount (e.g., $10 off).
   - **Fixed price** — Set a fixed price for the entire bundle regardless of individual product prices (e.g., Buy bundle for $100).
10. Enter the **Value** for your discount.

![Set up discount settings](/.gitbook/assets/create-mix-match/step-3.png)

11. In the **Widget display** section, click **Add widget** to integrate the widget into your theme, or click **Customize widget** to adjust styles and colors.
12. Configure content labels:
    - **Title**: The main headline on the bundle page.
    - **Description**: A subtitle explaining the bundle.
    - **'Total products:' label**: Shows the total product count.
    - **'Save' badge label**: Shows the discount amount. Keep `{{discount_value}}` intact.
13. (Optional) Configure **Promotion** settings to promote the bundle on product pages:
    - **Promotion Title**, **Promotion Badge Label**, **Promotion Button Label**.
    - **See more text**, **Badge Text**, **'From' Text**.

![Customize widget display](/.gitbook/assets/create-mix-match/step-4.png)

14. In the **Offer information** section, enter an **Offer title**. This title is visible to customers on the bundle page.
15. Set the **Status** to **Active** or **Draft**.
16. Configure **Schedule** — Set **Start date** and optionally toggle **Set end date** to run the offer for a limited time.
17. (Optional) Configure **Customer eligibility** — Choose **All customers** or **Specific customer segment** to target the offer.
18. (Optional) Configure **Discount combinations** — Allow combining with product, order, or shipping discounts.
19. (Optional) Set **Maximum discount uses** — Limit total uses or one use per customer.

![Configure advanced settings](/.gitbook/assets/create-mix-match/step-5.png)

20. Look at the **Preview** panel to see how the mix-and-match bundle page will appear.
21. Click **Save** to create the bundle offer.

![Preview and save](/.gitbook/assets/create-mix-match/step-6.png)

## What's Next

- [Mix-and-Match Display Settings](/docs/design/mix-match-display)
- [Create a Product Fixed Bundle](/docs/offers/create-product-fixed-bundle)
- [Manage Your Offers](/docs/offers/manage-offers)

---

*Was this article helpful? [Let us know](https://github.com/anthropics/claude-code/issues).*
