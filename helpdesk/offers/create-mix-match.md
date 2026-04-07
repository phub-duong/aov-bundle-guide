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

### Step 1: Create a new Mix-and-Match Bundle offer

Navigate to the offer creation page and select Mix-and-Match Bundle.

1. Go to **AOV.ai Bundle Discounts > Offers**.
2. Click **Create offer**.
3. Select **Mix-and-match bundle** from the offer type list.
4. Click **Create** to proceed.

![Select Mix-and-Match Bundle offer type](../public/images/create-mix-match/step-1.png)

### Step 2: Configure bundle options

Define the product options that customers can choose from.

1. In the **Bundle option** section, you will see **Bundle option 1** by default.
2. For each bundle option, configure:
   - **Option name** — Enter a descriptive name (e.g., "Choose your top", "Pick a color").
   - **Products** — Click **Browse** to select the products available for this option.
   - Set the quantity for each option.
3. Click **Add bundle option** to create additional options.
4. Use **Duplicate** to copy an existing option, or **Delete** to remove one.

> **Info:** Each option represents one selection the customer makes. For example, a "Build Your Outfit" bundle might have options for Top, Bottom, and Accessory.

![Configure bundle options](../public/images/create-mix-match/step-2.png)

### Step 3: Set up discount settings

Configure the discount customers receive when they complete the bundle.

1. In the **Discount settings** section, select a **Discount type**:
   - **Percentage** — Discount a percentage off the total (e.g., 15% off).
   - **Fixed amount** — Discount a specific dollar amount (e.g., $10 off).
   - **Fixed price** — Set a fixed price for the entire bundle regardless of individual product prices (e.g., Buy bundle for $100).
2. Enter the **Value** for your discount.

![Set up discount settings](../public/images/create-mix-match/step-3.png)

### Step 4: Customize widget display and content

Configure the text and appearance of the bundle widget.

1. In the **Widget display** section, click **Add widget** to integrate the widget into your theme, or click **Customize widget** to adjust styles and colors.
2. Configure content labels:
   - **Title**: The main headline on the bundle page.
   - **Description**: A subtitle explaining the bundle.
   - **'Total products:' label**: Shows the total product count.
   - **'Save' badge label**: Shows the discount amount. Keep `{{discount_value}}` intact.
3. (Optional) Configure **Promotion** settings to promote the bundle on product pages:
   - **Promotion Title**, **Promotion Badge Label**, **Promotion Button Label**.
   - **See more text**, **Badge Text**, **'From' Text**.

![Customize widget display](../public/images/create-mix-match/step-4.png)

### Step 5: Configure advanced settings

Fine-tune scheduling, eligibility, and offer details.

1. In the **Offer information** section, enter an **Offer title**. This title is visible to customers on the bundle page.
2. Set the **Status** to **Active** or **Draft**.
3. Configure **Schedule** — Set **Start date** and optionally toggle **Set end date** to run the offer for a limited time.
4. (Optional) Configure **Customer eligibility** — Choose **All customers** or **Specific customer segment** to target the offer.
5. (Optional) Configure **Discount combinations** — Allow combining with product, order, or shipping discounts.
6. (Optional) Set **Maximum discount uses** — Limit total uses or one use per customer.

![Configure advanced settings](../public/images/create-mix-match/step-5.png)

### Step 6: Preview and save

Review the bundle page before publishing.

1. Look at the **Preview** panel to see how the mix-and-match bundle page will appear.
2. Click **Save** to create the bundle offer.

![Preview and save](../public/images/create-mix-match/step-6.png)


Use **Mix-and-Match Bundle** to let customers build their dream bundle from your curated options. Start creating your first mix-and-match offer today!

## What's Next

- [Mix-and-Match Display Settings](/docs/design/mix-match-display)
- [Create a Product Fixed Bundle](/docs/offers/create-product-fixed-bundle)
- [Manage Your Offers](/docs/offers/manage-offers)

---

*Was this article helpful? [Let us know](https://github.com/anthropics/claude-code/issues).*
