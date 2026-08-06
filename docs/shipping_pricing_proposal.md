# Shipping & Pricing — Audit, Model Design, and Edge Cases

## Part 1 — Audit of what exists today

### Correct

The money path is **server-authoritative**. `backend/services/pricingService.js →
computeAuthoritativeOrder()` ignores every amount the browser sends and recomputes from the
product documents, the Settings document and the Coupon collection. `paymentController.js`
logs `[PRICING MISMATCH]` and charges the server figure. A customer editing prices in devtools
cannot underpay.

Also correct:

- Live settings are `$8` standard, `$18` express, free standard over `$200` — these **match the
  published shipping policy**.
- GST is treated as *included*, which is right for Australian consumer law.
- Coupons are re-validated server-side and `usedCount` is incremented on order creation, so a
  single-use code cannot be reused.
- Stock is decremented against the exact size/colour variant purchased, and the aggregate
  `stock` field stays in sync (verified: 0 of 58 products out of sync).

### Defects

```
#  DEFECT                                          WHERE                          EFFECT
1  Free-shipping threshold uses the PRE-COUPON     pricingService.js:82 vs :106   $210 cart + $50 coupon
   subtotal                                                                       pays $160 AND ships free
2  Stock validated on the product TOTAL, not the   pricingService.js:63           Can buy size XL when only
   size/colour ordered                                                            S has stock — oversell
3  Add-ons charged once per ORDER                  pricingService.js:104          Being removed (Part 4)
4  Add-on schema defaults $800 / $400 / $600       settingsModel.js               Being removed (Part 4)
5  Orphaned priorityShippingPrice: 3500            live Settings row              Dead field
6  Comment claims "Standard $15 or Express $65"    frontend/utils/pricing.js:12   Contradicts code below it
7  "FREE SHIPPING" pill on EVERY product card      components/Product/index.js    product.shipping defaults
                                                   :109                           true; checkout charges $8
8  Quotes "International shipping from Rs 1,200"   SingleProductPage/index.js:28  Rupees on an AU store, plus
                                                                                  a 30-day exchange promise
9  Four contradictory shipping claims             announcement bar, trust         "global", "free of charge",
                                                   signals, home trust bar        "$150+", "$200"
```

Defects 1, 2 and 7 are the live exposures.

---

## Part 2 — Why per-item pricing fails

The first draft of this proposal priced shipping as *base + $3 per extra item*. One case
disproves it:

> **10 pairs of earrings at $5 each.** Cart value $50. Per-item pricing charges
> `$8 + (9 × $3) = $35` — shipping is 70% of the order. The customer abandons.

Ten pairs of earrings weigh about a kilo and fit in one small satchel. **Item count is not what
couriers charge for — weight and volume are.** The unit has to be weight.

But asking the owner to enter a weight for every product fails too: 58 products, no logistics
background, and any field she must maintain by hand will drift and end up worse than a flat
rate.

**Resolution: derive weight automatically from the category, with an optional per-product
override.** She enters nothing. The system already knows whether a product is a Lehenga or a
pair of Earrings.

---

## Part 3 — Proposed model

### 3.1 Weight, derived from the taxonomy

Default shipped weight per category, packaging included:

```
Jewelry (all)              150 g
Kids (all)                 400 g
Men > KURTAS               600 g
Women > SALWAR KAMEEZ      700 g
Women > SAREES             800 g
Men > JACKET               900 g
Men > SHERWANIS          1,800 g
Women > LEHENGAS         2,000 g
```

An optional `shippingWeightGrams` field on the product overrides the default; left blank it
uses the category value. She never has to touch it.

Cart weight = `Σ (line weight × quantity)`.

### 3.2 Price bands

```
CART WEIGHT      STANDARD   EXPRESS
up to 0.5 kg         $5       $15
up to  2 kg          $8       $18
up to  5 kg         $14       $28
up to 10 kg         $22       $40
up to 22 kg         $35       $60
over  22 kg      quote required
```

The 0.5 kg tier exists because the catalogue starts at **$28** (jewellery). Charging $8 to post
a $28 pair of earrings is 29% of the order and kills conversion; a small satchel genuinely
costs less. This tier is *cheaper* than the published "$8 anywhere in Australia", so it
improves on the policy rather than contradicting it — no rewording needed.

Bands rather than a per-kilo formula, because that is how AusPost actually sells satchels, and
because a band table is something the owner can read and reason about.

### 3.3 Free shipping

Free standard shipping when the **amount actually paid — after product discount AND coupon —**
reaches the threshold ($200). Free shipping **credits the base rate ($8)**, not the whole
freight bill, so a heavy order pays only the difference. Express is never free.

This caps her exposure at exactly $8 per order, which is the number she already budgets for.

### 3.4 Remote-zone surcharge (phase 2 — needs a policy change first)

WA / NT / TAS and regional postcodes add a flat surcharge (suggest $6) to standard. Her policy
already tells customers those states take 8–10 days, so a difference is expected — **but the
published line "$8 for any size of order anywhere in Australia" must be reworded first.**
Recommend shipping the model without this, then enabling it once the policy is updated.

### 3.5 Effect on real orders

```
ORDER                                    TODAY   PROPOSED
1 pair of earrings -> Melbourne             $8   $8
10 pairs of earrings ($50) -> Sydney        $8   $8      (1.5 kg)
1 saree -> Brisbane                         $8   $8
1 lehenga ($260) -> Perth                   $0   $0      (qualifies)
$210 cart + $50 coupon                      $0   $8      (no longer qualifies)
3 suits -> Adelaide                         $8   $14     (2.1 kg)
10 lehengas (20 kg) -> Perth                $8   $35
30 lehengas (wholesale)                     $8   quote
```

The headline **"$8 anywhere in Australia" stays true for every ordinary order** — any single
garment, and jewellery orders up to roughly a dozen pieces. Only genuinely bulky carts move up
a band.

---

## Part 4 — Removing add-ons

Hemming / Gift Box / Petticoat were temporary and are removed completely:

```
frontend/src/utils/pricing.js          ADDON_DEFS, addonOptions, addons/addonsTotal in
                                       computeOrderSummary
frontend/src/pages/CheckoutPage        add-on checkbox block, selectedAddons state,
                                       summary row, request payload
frontend/src/pages/admin/SettingsPage  the three money fields
frontend/src/context/settings_context  the three defaults
backend/models/settingsModel.js        hemmingPrice, giftBoxPrice, petticoatPrice
backend/services/pricingService.js     ADDON_DEFS, resolveAddons, add-on maths
backend/controllers/paymentController  addons in the request and the eWAY metadata
backend/services/orderService.js       addonKeys parsing from metadata
database                               unset hemmingPrice, giftBoxPrice, petticoatPrice,
                                       priorityShippingPrice on the Settings row
```

Historical orders that already recorded add-ons keep their stored totals — nothing is
back-dated.

---

## Part 5 — Edge cases

### Cart composition

1. **Many light items** (10 earrings) — solved by weight; stays in the $8 band.
2. **Quantity on one line** (qty 5 of one earring) — weight must multiply by quantity, not by
   cart line. Easy to get wrong.
3. **Mixed cart** (1 lehenga + 2 earrings) — 2.3 kg, so the $14 band.
4. **Empty cart** — shipping $0, no band lookup.
5. **Product with no category match** — fall back to a safe default (800 g, never 0 g).
6. **Product deleted mid-checkout** — already throws 404; keep that behaviour.

### Money and discounts

7. **Coupon drops the order under the threshold** — the threshold is tested on the paid amount,
   so free shipping is correctly withdrawn. This is defect 1.
8. **Percentage vs fixed coupon** — both resolve to dollars before the threshold test.
9. **100% coupon** — order total $0 but shipping is still charged; the total must never go
   negative.
10. **Free-shipping coupon type** — the coupon model only supports `PERCENTAGE` and
    `FIXED_AMOUNT`. A `FREE_SHIPPING` type is a natural addition; noted, not built.
11. **Threshold lands between bands** — a $205 order weighing 6 kg gets the $8 credit against a
    $22 band and pays $14. Must display as "Shipping $22, less $8 free-shipping credit", never
    as a bare $14.
12. **Refund or exchange** — shipping is not refunded, matching the written policy.
13. **Rounding** — one `round2` helper applied at the same points on client and server.

### Geography

14. **Missing or invalid postcode** — must never silently fall through to the cheapest zone.
    Default to charging the surcharge, or block until a valid postcode is entered.
15. **Non-Australian address** — policy is Australia-only; block with a "contact us" message
    rather than quietly charging $8.
16. **PO Box / Parcel Locker** — express is not always deliverable there; flag at checkout.
17. **Postcode data size** — Australia has ~16,000 postcodes, so store **ranges** (about 40
    entries), never a per-postcode list.

### Operations

18. **Over-22 kg quote gate** — checkout must stop and capture the request rather than
    completing. Needs a small quote-request flow and an admin view.
19. **Cart changed after a quote** — the quote must be invalidated when the cart weight changes.
20. **Settings edited mid-checkout** — the pending checkout should lock its quoted figures so
    the customer is charged what they were shown.
21. **Express cutoff (2 pm AEST)** — the estimate shown must respect the cutoff and the
    customer's timezone, or it over-promises.
22. **Multiple parcels** — above roughly 5 kg an order ships as more than one satchel. The band
    table absorbs the cost, but the packing slip should say so.

### Integrity

23. **Client tampering with method, postcode or weight** — every input re-read server-side from
    the saved shipping address and the product documents. The browser figure is display-only.
24. **Sanity cap** — an absolute maximum shipping charge, so a data error can never bill $500.
25. **Auditability** — store the full breakdown (weight, band, zone, credit applied) on the
    order, so the owner can answer "why was I charged this?" without a developer.

---

## Part 6 — How it is built

### Where the data lives

Two kinds of configuration, split by who changes it and how often.

**`frontend/src/utils/shipping.json`** — structural data that rarely changes, required by the
backend exactly as `productModel.js` already requires `taxonomy.json`. Following the existing
pattern keeps one source of truth:

```jsonc
{
  "defaultWeightGrams": 800,
  "categoryWeights": {
    "Jewelry": 150,
    "Kids": 400,
    "Men.KURTAS": 600,
    "Women.SALWAR KAMEEZ": 700,
    "Women.SAREES": 800,
    "Men.JACKET": 900,
    "Men.SHERWANIS": 1800,
    "Women.LEHENGAS": 2000
  },
  "zones": {
    "standard": { "label": "Metro & East Coast", "surcharge": 0 },
    "remote":   { "label": "WA / NT / TAS & Regional", "surcharge": 6 }
  },
  "postcodeRanges": [
    { "from": 800,  "to": 999,  "zone": "remote" },
    { "from": 6000, "to": 6999, "zone": "remote" },
    { "from": 7000, "to": 7999, "zone": "remote" }
  ]
}
```

**Store Settings (database, edited in the admin panel)** — the money: four standard band
prices, four express band prices, the free-shipping threshold, the remote surcharge, the quote
cutoff weight and the sanity cap. She tunes prices herself, no deploy.

### Where the logic lives

`backend/services/pricingService.js` stays the single authority. A new
`calculateShipping(items, address, settings)` returns:

```js
{ weightGrams, band, zone, baseFee, surcharge, freeCredit, fee, requiresQuote }
```

`frontend/src/utils/pricing.js` mirrors it for display only, importing the same JSON, so the
cart preview and the charged amount cannot diverge in structure — and the server still wins.

### Order of work

1. Free-shipping-after-coupon fix — one line, pure leak.
2. Variant-level stock validation at checkout — prevents overselling.
3. Remove add-ons end to end (Part 4).
4. Remove the "FREE SHIPPING" product pill; correct the Rs 1,200 text and the four
   contradictory marketing lines.
5. Build `shipping.json`, `calculateShipping()`, the Settings fields and the order breakdown.
6. Quote gate for over-22 kg orders.
7. Later: remote-zone surcharge (after the policy wording is updated), and a `FREE_SHIPPING`
   coupon type.

Steps 1–4 carry no business decision. Step 5 needs sign-off on the band prices.

---

## Part 7 — Business logic gaps beyond shipping

Found by auditing the live catalogue (58 products, 2 orders, 0 coupons — the shop is
effectively pre-launch, which is the cheapest possible moment to fix all of this).

### 7.1 Cancelling an order silently destroys inventory — **bug**

`orderController.js:142` restores stock with `product.stock += item.quantity`, writing only to
the aggregate field. But `orderService.js` decrements the **variant**, and `productController`
**recomputes `stock` from the variants** every time a product is edited.

So: order cancelled → aggregate goes up → owner edits the product → aggregate is recomputed
from variants → the restored stock disappears. The garment is physically back on the rack but
the website says it is sold out, and nothing in the UI explains why.

The fix mirrors the decrement logic: restore the specific size/colour variant, then recompute
the aggregate. The same applies to the `returned` status.

### 7.2 No cost price — she cannot see profit

There is no cost field anywhere. She therefore cannot tell whether a 25% markdown plus free
shipping to Darwin makes or loses money, and neither can we. For a store owner this is the
single most important missing number.

Add an admin-only `costPrice` (never sent to the storefront). It unlocks margin per product,
margin per order, and a guard that warns before saving a discount that sells below cost.

### 7.3 New products are silently 20% off

`productModel.js` sets `discountPercent` default **20**. Any product added without touching
that field is marked down 20% forever. The live data shows the owner is fighting it — 41 of 58
products are set to 0% — but the default is a trap. **Change the default to 0.**

### 7.4 Delivery promises ignore make time

**54 of 58 products carry `leadTimeDays > 0`** — nearly the whole catalogue is made to order.
The product page does show "Ships in N days", but the checkout delivery estimate does not:
Express still advertises *"Next day – 2 days"*.

A customer buying a 10-day lehenga with Express Post is told it arrives tomorrow. That is the
complaint that generates a refund demand, and her shipping policy explicitly disclaims delivery
dates — which will not help if the site promised next-day at checkout.

Delivery estimate must be `max(leadTimeDays across the cart) + transit band`.

### 7.5 Jewellery sizing is incoherent

Jewellery variants use **M**, **Free Size** *and* **One Size** — three spellings of "no size" —
because the product form demands a size for every category. A shopper picking "Medium" earrings
is confused, and the new variant-level stock check will hard-reject an order whose size does not
match a variant exactly.

Jewellery should default to a single sizeless variant, and the size selector should be hidden
for categories that do not have sizes.

### 7.6 Coupons — no guard rails

The coupon model has `code`, `type`, `amount`, `expiry`, `minPurchase`, `usageLimit`,
`usedCount`. It is missing everything that stops abuse:

- **Stacks on already-discounted stock.** A 25%-off product plus a 20% coupon sells at 40% off.
  Needs an "exclude products already on markdown" switch.
- **No per-customer limit.** `usageLimit` is global, so one person can use a code 100 times.
- **No first-order-only option**, the most common acquisition offer.
- **No category or product exclusion** — a code meant for jewellery applies to bridal lehengas.
- **No `FREE_SHIPPING` type**, which is the offer she will most likely want to run.

Zero coupons exist today, so this can be designed properly before the first campaign.

### 7.7 No stock reservation during payment

Stock is decremented only after eWAY confirms. Between "pay now" and the webhook, the item is
still purchasable. With single-piece bridal inventory — and most products here have stock of 1 —
two customers can pay for the same garment. One then gets a cancellation and a refund.

Needs a short-lived reservation on the variant when checkout starts, released on
failure/timeout. The `pendingCheckout` model already exists to hang this off.

### 7.8 Smaller items

- **No minimum order value.** A $28 order is viable at the $5 shipping tier, so this is
  acceptable — but worth a conscious decision rather than an accident.
- **Free-shipping threshold ($200) sits above the median product price ($160)**, so most
  single-item orders will pay shipping. That is a reasonable incentive to add a second item,
  but she should know that is the behaviour she is buying.
- **No "made to order / non-returnable" flag**, even though the returns policy says
  custom-stitched orders are non-returnable. Nothing enforces it.

### 7.9 Recommended additions to the order of work

```
 8. Fix variant-level stock restore on cancel/return          (bug, no decision)
 9. Change discountPercent default from 20 to 0               (bug, no decision)
10. Add leadTimeDays into the checkout delivery estimate      (bug, no decision)
11. Add admin-only costPrice + margin visibility              (needs her input on values)
12. Hide size selection for sizeless categories; normalise
    jewellery to one variant                                  (needs a data cleanup pass)
13. Coupon guard rails: per-customer limit, exclude-markdown,
    first-order-only, category exclusion, FREE_SHIPPING type   (design before first campaign)
14. Stock reservation during payment                           (matters most for 1-of-1 stock)
```


---

## Part 8 — Implementation status

Everything below is built, builds clean under `CI=true`, and was tested against the live
catalogue.

### Shipping and pricing

- `frontend/src/utils/shipping.json` — weights, bands, zones, postcode ranges. Required by the
  backend directly, the same pattern `productModel.js` uses for `taxonomy.json`.
- `backend/services/shippingService.js` — `weightOf`, `cartWeight`, `zoneForPostcode`,
  `calculateShipping`. Authoritative.
- `pricingService.computeAuthoritativeOrder` now calls it, takes the shipping address, throws a
  quote-required error over the cutoff, and returns a `shippingBreakdown`.
- `frontend/src/utils/pricing.js` mirrors the same maths for the cart preview.
- Cart lines now carry `category`, `subCategory`, `shippingWeightGrams`, `leadTimeDays`.
- Order documents store the shipping breakdown, so a charge can be explained later.
- Checkout blocks with a contact message when a cart needs a manual quote.
- Admin → Settings has an editable band table plus remote surcharge, quote cutoff and the
  safety cap.

Verified against real products:

```
1 pair earrings $28                 $5     (was $8)
10 pairs earrings $50               $8     (per-item pricing would have charged $35)
1 salwar suit $67                   $8
1 lehenga $315                      FREE   (over threshold)
3 salwar suits $202                 $6     ($14 band less the $8 credit)
10 lehengas $2,600                  $27    (was $8)
30 lehengas                         quote required
1 lehenga EXPRESS                   $18
```

Free shipping credits the **headline standard rate** ($8), not the cheapest band. An ordinary
order is therefore genuinely free as promised, and her exposure is capped at $8 per order.

### Bugs fixed

- Free-shipping threshold now tested after the coupon (server and client).
- Stock validated per size/colour variant; resolves leniently for sizeless jewellery.
- Cancel/return now restores the **variant**, not just the aggregate — restored stock was
  previously wiped the next time the product was edited.
- `discountPercent` default 20 → 0.
- Add-ons removed end to end, including the live Settings document.

### Admin panel

- **`AdminPrivateRoute` never rendered a `<Route>`.** It returned `children` directly, so no
  router match context existed, `useParams()` returned `{}`, and every admin detail page
  fetched with `id === undefined`. This was the single cause of both reported errors — the
  blank "Product ID:" and the order page's "Something went wrong" (`id.slice(-8)` on
  undefined). Now renders a real `<Route>`, with the privilege rules moved into a lookup table.
- **`components/admin/ActionMenu.js`** — one reusable, measured dropdown replacing the copy of
  the positioning logic that each table carried. The old code guessed the menu size
  (`MENU_HEIGHT = 260`, `left: rect.right - 144`) and the guesses did not match the real menu,
  which is why it flipped upwards too eagerly and sat away from its row. The menu is now
  measured after mount, clamped inside the viewport, and closes on scroll, resize and Escape.
- `truncate()` helper in `utils/helpers.js`; a product or order item with a missing name no
  longer throws and blanks the table. Also fixes the "…" that used to append to short names.
- `SingleProductPage` refetches when the id changes (was `[]`, so it showed the previous
  product).
- `OrderItemsList` handles an empty item list.
- Removed the "Free Shipping" product toggle and storefront facet — the flag defaulted true on
  every product, so the facet never filtered anything and the badge promised something checkout
  did not honour.

### Customer-facing copy

Announcement bar, trust signals and the home trust bar now all state the same rule as the
policy and the checkout. The product page no longer quotes rupees, and delivery estimates
include make time for made-to-order stock.

### Client workbook

`13. Shipping & Pricing` added — plain-language configuration rows (no jargon), showing every
price, the free-delivery rule, how parcel size is decided, worked examples of what a customer
actually pays, and where she changes each value. `12. Issues & Actions` updated with everything
now fixed.

### Not built

Still open from Part 7, none of them blocking: admin-only `costPrice` and margin reporting,
coupon guard rails (per-customer limit, exclude-markdown, first-order-only, `FREE_SHIPPING`
type), stock reservation during payment, and the jewellery sizing cleanup (M / Free Size / One
Size used interchangeably). The remote-zone surcharge is wired but left at $0 until the
published "$8 anywhere in Australia" line is reworded.
