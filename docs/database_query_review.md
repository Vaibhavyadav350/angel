# MongoDB Query Review

Assessment of the data layer as it stands, and what to fix before real traffic.

**Overall: 7/10.** The architecture is sound and the security-critical parts are
right. What is missing is the query-tuning layer — indexes, projections and
atomicity — which is normal for a codebase that grew feature-first and has never
been under load.

Nothing below will bite at the current scale (58 products, 2 orders). Items 1 and
2 are worth doing before production order data accumulates, because both are
cheaper to fix now than later.

---

## Measured footprint

```
11 models · 17 files touching a model · 118 query calls · 1 aggregation
.lean()  used in 0 files
.select() used in 1 file
atomic update operators used: 1
```

---

## What is already right

Worth not breaking while fixing the rest.

- **Server-authoritative pricing.** `pricingService.computeAuthoritativeOrder`
  recomputes every amount from the database and never trusts the browser.
- **Unique index on `paymentInfo.id`** — idempotency enforced at the database
  level, so a retried eWAY callback cannot create a duplicate order.
- **TTL index on `stockReservation.expiresAt`** — abandoned checkouts release
  their hold with no cron job.
- **Schema enums derived from `taxonomy.json`** — one source of truth shared by
  validation, the admin dropdowns and the storefront.
- **`catchAsyncError` on every controller** — no unhandled promise rejections.

---

## 1. Stock decrement is not atomic — correctness bug

**Severity: high.** This is the only item on the list that is a bug rather than a
performance gap.

`services/orderService.js` (and the restore paths in `orderController.js`) do a
read-modify-write:

```js
const product = await Product.findById(item.product);   // read
variant.stock = Math.max(0, variant.stock - item.quantity); // modify in JS
await product.save({ validateBeforeSave: false });      // write
```

Two orders for the last piece can both read `stock: 1`, both compute `0`, and
both succeed — overselling a one-of-a-kind garment. The reservation system
narrows the window during checkout but does not close it, because the decrement
itself is still racy.

**Fix.** Use a filtered atomic update so the database enforces the invariant:

```js
const res = await Product.updateOne(
  { _id: item.product, 'variants.size': item.size, 'variants.color': item.color,
    'variants.$.stock': { $gte: item.quantity } },
  { $inc: { 'variants.$.stock': -item.quantity, stock: -item.quantity } }
);
if (res.modifiedCount === 0) { /* insufficient stock — surface, do not silently pass */ }
```

Note the aggregate `stock` field must move in the same operation, or it drifts
from the sum of its variants.

**Effort:** half a day, mostly re-testing against the reservation logic.

---

## 2. Missing index on `user.email` — becomes the slowest page

**Severity: high (latent).**

```js
Order.find({ 'user.email': email }).sort({ createdAt: -1 })
```

This runs on every visit to `/orders` and currently performs a full collection
scan. Invisible at 2 orders; the slowest page on the site at 5,000.

**Fix.** One compound index that satisfies both the filter and the sort:

```js
orderSchema.index({ 'user.email': 1, createdAt: -1 });
```

**Effort:** minutes.

---

## 3. N+1 queries in six places

**Severity: medium.**

`Product.findById` inside a loop, in:

```
services/pricingService.js:42     cart pricing
services/orderService.js:97       order creation
services/orderService.js:168      stock decrement
controllers/orderController.js    cancel / return / restock (3 sites)
```

A five-item cart makes five sequential round trips where one would do.

**Fix.** Load once, then work from a map:

```js
const ids = cart.map((c) => c.productId || c.id);
const products = await Product.find({ _id: { $in: ids } });
const byId = new Map(products.map((p) => [String(p._id), p]));
```

**Effort:** 2–3 hours across all six sites.

---

## 4. No `.lean()` anywhere

**Severity: medium.**

`getAllProducts` hydrates up to 1,000 full Mongoose documents — each with its
`reviews[]` array — then maps and discards most of the result. Hydration builds
getters, setters and change tracking that a read-only endpoint never uses.

**Fix.** Add `.lean()` to every read-only query. Typically halves time and
memory on list endpoints.

**Effort:** under an hour, low risk — the only caveat is that lean documents have
no Mongoose instance methods.

---

## 5. No projection on the product list

**Severity: medium.**

The same query fetches `description`, `careInstructions`, `costPrice` and every
review, to render a grid that shows a name, a price and an image.

**Fix.** Project only what the card needs:

```js
Product.find()
  .select('name price images colors sizes variants category subCategory productType collections stock discountPercent rating numberOfReviews leadTimeDays shippingWeightGrams featured isTrending')
  .limit(1000)
  .lean();
```

This also removes the risk of `costPrice` reaching the storefront by accident —
it is excluded by hand today, which relies on nobody editing the mapping.

**Effort:** 30 minutes.

---

## 6. Unbounded queries

**Severity: low today, high once data grows.**

```
controllers/adminController.js:62       Admin.find()
controllers/couponController.js:17      Coupon.find()
controllers/newsletterController.js:44  Newsletter.find()
controllers/orderController.js:106,238  Order.find()
```

Correct at present volumes. The orders and newsletter lists are the ones that
will grow without limit.

**Fix.** Add `.limit()` plus skip/cursor pagination to the admin tables. The
`DataTable` component already has the states needed to show a paged list.

**Effort:** half a day including the admin UI.

---

## Suggested order

| # | Item | Why this order | Effort |
|---|---|---|---|
| 1 | `user.email` index | One line, removes a full scan | Minutes |
| 2 | `.lean()` + `.select()` on product list | Biggest speed win per minute spent | ~1 hour |
| 3 | Atomic stock decrement | Correctness; cheaper before real orders exist | Half a day |
| 4 | N+1 consolidation | Scales with cart size | 2–3 hours |
| 5 | Pagination on admin lists | Only matters once data grows | Half a day |

Items 1 and 2 together take about an hour and capture most of the available
performance. Item 3 is the one that protects against overselling.

---

## Not recommended

- **Migrating off MongoDB.** See `home_page_redesign_plan.md` discussion — the
  coupling is 118 call sites across 17 files, and Firestore has no joins, no
  aggregation pipeline and no schema validation. Two to four weeks for a rewrite
  that removes one managed service.
- **Adding a caching layer.** Premature. Fix the indexes and projections first;
  at this data volume they will be enough.
