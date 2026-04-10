---
title: "Create a Volume Discount"
description: "Step-by-step guide to creating a volume discount offer with tiered pricing in AOV Bundle."
---

# Create a Volume Discount

Volume Discount lets you offer tiered discounts based on the quantity of items a customer purchases. The more they buy, the bigger the discount they receive. A discount table is displayed on the product page to show customers exactly how much they save at each tier.

> **Info:** **Prerequisites:** AOV Bundle installed and active. Products must already be added to your Shopify store. Optionally, enable the app embed block in your theme settings for the widget to display on your storefront.

## Why Volume Discount?

- **Encourage bulk purchases** — Tiered pricing motivates customers to buy more items to unlock better discounts, directly increasing your order value.
- **Clear savings visibility** — A discount table on the product page shows all tiers at a glance, making it easy for customers to see the benefit of buying more.
- **Flexible discount types** — Support percentage, fixed amount, fixed price, and even "Buy X Get X free" deals to match any promotion strategy.

## Steps

1. Go to **AOV.ai Bundle Discounts > Offers**.
2. Click **Create offer**.
3. Select **Volume Discount** from the offer type list.
4. Click **Create** to proceed.

![Select Volume Discount offer type](/.gitbook/assets/create-volume-discount/step-1.png)

5. In the **Trigger conditions** section, choose **Any items from**:
   - **Specific products** — Select individual products.
   - **Specific collections** — Select entire collections.
6. Click **Browse** to search and select your trigger products or collections.
7. (Optional) Configure **Markets** to limit the offer to specific Shopify markets. Default is **All Markets**.

![Configure trigger conditions](/.gitbook/assets/create-volume-discount/step-2.png)

8. In the **Discount settings** section, select a **Discount type**:
   - **Volume discount** — Set discount tiers based on quantity.
   - **Buy X Get X** — Buy a certain quantity and get extra items free.
9. For each tier, configure:
   - **Product quantity** — The minimum number of items the customer must buy.
   - **Discount type** — Choose **Percentage**, **Fixed amount**, **Fixed price**, or **Free**.
   - **Value** — The discount value for that tier.
10. Click **+ Add tier** to add more discount levels.
11. (Optional) Toggle **Set as default** to pre-select a tier for customers.
12. (Optional) Toggle **Enable badge** to show a badge label on a tier (e.g., "Most popular").

![Set up discount tiers](/.gitbook/assets/create-volume-discount/step-3.png)

13. In the **Offer widget** section, configure:
    - **Title**: The headline displayed above the discount table.
    - **Tier title** and **Subtitle** for each tier.
    - **Badge** label for each tier (e.g., "Best value").
    - **Saving**: The saving text displayed to customers.
14. **Select layout widget** — Choose between horizontal or vertical display.
15. **Redirect after Add to cart** — Choose where the customer goes after clicking the button:
    - **Stay on current page**
    - **Cart page**
    - **Checkout page**
16. (Optional) Toggle **Display custom image** to show a custom image instead of the product thumbnail.
17. (Optional) Enable **Countdown timer** to add urgency. Configure the timer format and position.

![Configure offer widget](/.gitbook/assets/create-volume-discount/step-4.png)

18. In the **Advanced Configuration** section, configure:
    - **Schedule** — Set **Start date** and optionally toggle **Set end date**.
    - **Customer eligibility** — Choose **All customers**, **Specific customer segment**, or **Exclude specific customer segments**.
    - **Maximum discount uses** — Limit total uses or one use per customer.
    - **Pricing option** — Toggle **Show prices per item**, **Apply discount for exact quantity only**, or **Use the product's compare-at price**.
19. Enter an **Offer name** in the **Offer information** section. This name is internal only.

![Configure advanced settings](/.gitbook/assets/create-volume-discount/step-5.png)

20. Look at the **Preview** panel on the right to see how the volume discount table will appear on the product page.
21. Click **Save** to activate the offer.

![Preview and save](/.gitbook/assets/create-volume-discount/step-6.png)

## What's Next

- [Volume Discount Display Settings](/docs/design/volume-display)
- [Manage Your Offers](/docs/offers/manage-offers)
- [Set Offer Trigger Conditions](/docs/offers/offer-triggers)

---

*Was this article helpful? [Let us know](https://github.com/anthropics/claude-code/issues).*
