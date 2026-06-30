# Payments, Pricing & Inventory

## Pricing model (the rules)

All money is **AUD** and **GST-inclusive** (Australian consumer law — GST is never added on top, only shown as included).

- **`product.price`** = the RRP (recommended retail price), GST-inclusive.
- **`product.discountPercent`** = optional per-product markdown, set in the Add/Edit Product screen.
- **Selling price** = `price × (1 − discountPercent/100)` — what the customer actually pays per unit. This single value feeds the cart, line items, and subtotal.
- **Coupons** (codes) stack on top of the per-product discount, at checkout.
- **Shipping** is flat per method: **Standard $15 / Express $65**, configurable in **Store Settings**. Optional free-shipping threshold.
- **Add-on services** (hemming / gift box / petticoat) are optional, priced from Store Settings.
- **GST** displayed = `total / 11` (the 10% already inside a GST-inclusive total).

### The itemised breakdown (shown identically in cart, checkout, admin order, invoice)
```
Item Total (RRP)
− Product Discount
− Coupon
+ Add-on services
+ Delivery (Standard/Express)
─────────────────
To Pay      (includes GST of <total/11>)
```

### Single sources of truth
- **Display math:** `frontend/src/utils/pricing.js` (`computeOrderSummary`, `unitSellingPrice`, `shippingMethods`, `addonOptions`, `gstIncludedIn`). Driven by store settings via `settings_context`.
- **Charged amount:** `backend/services/pricingService.js` (`computeAuthoritativeOrder`). **The server recomputes the real total from the DB and never trusts the browser** — item prices from the product docs, shipping/GST from `Settings`, the coupon re-validated against the DB. Client amounts are logged on mismatch and ignored.

> History: prices were once derived inconsistently in ~5 places (card vs detail vs cart vs order vs invoice), and the backend trusted the browser's total (a tamper hole). Both are fixed — always go through `pricing.js` (display) / `pricingService.js` (charge). Never hardcode prices, GST, or shipping in components.

## Store Settings

A single `Settings` document, edited at **Admin → Settings** (`/admin/settings`, route `PUT /api/settings`, admin-only):
- Shipping: `standardShippingPrice`, `expressShippingPrice`, `expressEnabled`, `freeShippingThreshold`
- Tax: `gstRate`
- Add-ons: `hemmingPrice`, `giftBoxPrice`, `petticoatPrice`
- `announcementText`

The storefront loads these via `settings_context`; the backend reads the same doc when computing the authoritative charge.

## eWAY payment flow (Responsive Shared Page)

Payments use **eWAY Rapid** in **Responsive Shared Page (RSP)** mode — eWAY hosts the card page; we never touch card data.

```
1. Checkout → POST /api/payment/create-checkout-session
     • paymentController calls pricingService.computeAuthoritativeOrder (server-side total)
     • creates an eWAY transaction; order metadata is packed into eWAY "Options"
       (pipe-delimited: m:meta | i:items | s:shipping), since eWAY mangles JSON
     • returns the eWAY SharedPaymentUrl
2. Browser → eWAY hosted page → customer pays
3. eWAY → GET https://prod-api.angelfashionstudio.org/api/payment/callback?AccessCode=…
     • webhookController queries the transaction (queryTransaction)
     • requires TransactionStatus === true AND ResponseCode === '00'
     • createOrderFromTransaction(): rebuilds order from the Options metadata,
       creates the Order (idempotent on TransactionID), decrements stock,
       updates coupon usage + user spend, fires the confirmation email (fire-and-forget)
     • redirects browser → FRONTEND_PUBLIC_URL/orders?success=true
4. Cancel → /api/payment/cancel → FRONTEND_PUBLIC_URL/checkout?canceled=true
```

- **Idempotency:** the order's `paymentInfo.id` (eWAY TransactionID) is unique; duplicate callbacks won't double-create.
- **Reconciliation:** `reconciliationService` runs every 15 min to recover orders if the browser never returned from eWAY (uses the saved `PendingCheckout` AccessCode).
- `EWAY_ENDPOINT` = `Sandbox` (test cards) or `Production` (real money).

## Inventory

Products use a **variant matrix**: each `variants[]` entry is `{ size, color, stock, sku }`. The product's global `stock` field is the **sum of variant stocks**.

**On successful payment** (`orderService.createOrderFromTransaction`):
- The **specific size+color variant** the customer bought is decremented (clamped at 0).
- The global `stock` is recomputed as the sum of variants — so it stays consistent and survives product edits (the product controller recomputes `stock` from variants on every save).

> Previously only the global field was decremented, leaving variant stock stale (the Inventory page never reflected sales) and the decrements were wiped on the next product edit. Fixed.

### Known related items to watch
- **Cancel / return restock** (`orderController`) historically restored only the global `stock`, not the variant — same class of bug; verify it restocks the variant + recomputes global.
- The checkout stock **check** validates against global stock; for strict per-variant oversell prevention it should check the specific variant (the frontend already guards per-variant).
- After deploying the variant-decrement fix, do a **one-time inventory recount** in the admin — historical variant counts never reflected past sales, so they read high.

## Invoices & emails

On order creation, `pdfService.generateInvoiceBuffer` builds an A4 GST **tax invoice** (PDFKit + QR code) that is attached to the confirmation email. The invoice and the confirmation email both show the full itemised breakdown and "Includes GST of …". See [email.md](email.md).
