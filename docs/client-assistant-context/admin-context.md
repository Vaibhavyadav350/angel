# Angel Fashion Studio — Admin Panel Reference

What the admin panel (`admin.angelfashionstudio.org`) already does today, so a
request can be sorted into "she can already do this herself", "this is a small
tweak to an existing screen", or "this is a genuinely new feature".

## Existing admin sections

- **Products** — create/edit products: name, description, category/sub-category/
  product type (from the same taxonomy as the storefront), price, discount
  percentage, brand ("Angel Fashion Studio" by default), fabric/cloth, photos
  (uploaded to Cloudinary), and **variants** — stock tracked per size + colour
  combination (except Jewellery, which is sizeless and tracks stock as a
  single number). Also sets which **Curated Collections** a product belongs to
  (New Arrivals, Sale, Best Sellers, Ready To Ship, Plus Sizes) — this
  checkbox is what drives the coloured badge shown on the product card on the
  storefront (Sale outranks New Arrival, which outranks Best Seller, etc. —
  a product can be in several collections at once).
- **Orders** — view orders, update status (processing/shipped/delivered),
  add a tracking number, process cancellations/returns (which restores stock).
- **Inventory** — stock levels per product/variant; a low-stock flag shows on
  the storefront card when 3 or fewer remain.
- **Coupons** — percentage or fixed discount codes, with rules: minimum spend,
  per-customer usage limit, expiry, whether it excludes already-discounted
  items, and a "free shipping" coupon type.
- **Settings** — shipping bands (weight-based pricing for Standard vs Express
  post), the free-shipping threshold, GST rate, and similar store-wide numbers.
  Nothing about page layout or images lives here.
- **Banners** — a small number of promotional banner slots (separate from the
  department header images described in the frontend reference).
- **Testimonials / Customer Diaries** — the reviews shown on the home page.
- **Admin users** — who can log in to the admin panel, with two access levels
  (standard "moderate" vs "super" admin for sensitive actions).

## Things that do NOT exist yet (would be a real new feature, not a tweak)

- No way to reorder the home page sections, or turn a whole section on/off,
  from the admin panel — that requires a code change.
- No way to add a brand-new category, sub-category, collection or cloth from
  the admin UI — the taxonomy is a fixed list maintained in code. Adding
  "Co-ord Sets" as a real, separate, filterable category (rather than folding
  it into an existing one like Palazzo Suits) is this kind of request.
- No way to upload or change the top-level department portraits, the
  decorative department banners, or the home page tile images from the admin
  panel — those are files in the codebase, changed by a developer, not
  content she can swap herself today.
- No customer-facing search-by-image, size-recommendation, or similar
  "smart" features — anything like that is a from-scratch feature.
- No multi-currency or multi-language support.

## What this means for triaging a request

- "Change this product's price/photo/stock/collection tag" → she can already
  do this herself in **Products**. Point her there instead of logging it as a
  dev task, unless she's tried and it's not working.
- "Add a new coupon / adjust shipping cost" → already possible in
  **Coupons** / **Settings**.
- "Change a picture on the home page or a department page" → genuinely a dev
  task (see the frontend reference for exactly which image slot).
- "Add a whole new admin screen / a new kind of data / a new category" →
  a real feature request — get as much detail as possible: what should it
  show, who uses it, and what should happen when it's used.
