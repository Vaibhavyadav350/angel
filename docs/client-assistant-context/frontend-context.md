# Angel Fashion Studio — Storefront Reference

This is a plain-language map of the customer-facing website, for an assistant
helping the store owner describe a change or a problem clearly. It contains no
code — only what exists, what it's called, and where it lives.

## Brand

- Name: **Angel Fashion Studio**, an Australian (Melbourne/Truganina) Indian
  ethnic-wear store.
- Colours (always by these names, never a hex code the owner has to remember):
  **champagne** (pale background), **bronze** (body text), **gold** (accent /
  links / active states), **chocolate** (dark text / footer).
- Currency: AUD, prices are GST-inclusive.
- Customer-facing domain: `www.angelfashionstudio.org`. Admin panel is a
  separate subdomain, `admin.angelfashionstudio.org`.

## Site structure

- **Home page** (`/`): hero banner, a scrolling promise marquee (shipping /
  made-to-order / exchange facts), "Shop by Cloth" (circular fabric swatches),
  "Curated Collections" (a grid of category tiles — this is the one with
  photos per sub-category), an occasions strip, customer testimonials
  ("Customer Diaries"), a category showcase, and a newsletter/trust strip.
- **Collections / listing page** (`/products`): every department, sub-category,
  collection and cloth filter lands on this ONE page — only the header banner,
  colour and photo change. It has a filter sidebar, a sort bar, and the product
  grid.
- **Single product page** (`/products/:id`): one product's own photos,
  description, size/colour picker, price.
- **Cart, Checkout, Orders, Wishlist, Account** — standard e-commerce pages.
- **About, Contact, Shipping Policy, Refund Policy, Terms, Privacy** — static
  informational pages.

## The taxonomy — use these exact names when describing a page

The whole site (menus, filters, images, product data) is driven by one shared
list of categories. When the owner says "the men page" or "the earrings
section", map it to one of these exact names so nothing gets applied to the
wrong page:

**Women** → sub-categories: **Salwar Kameez** (product types: Anarkali suits,
Gharara suit, palazzo suits, pant suits, punjabi suits, sharara suits,
pakistani suits, kurti), **Sarees** (Wedding Sarees, casual wear), **Lehengas**
(Bridal Lehengas, Partywear Lehengas, Indo Western).

**Men** → sub-categories: **Sherwanis** (Classic Sherwani, Indowestern
Sherwani), **Jacket** (jacket sets, jodhpuri jacket sets), **Kurtas** (kurta
pajama sets, long kurta set, short kurta set).

**Kids** → **Girls**, **Boys**.

**Jewellery** (spelled the British way on the site; the underlying data still
says "Jewelry" internally, that's fine, don't "fix" it) → **Bridal**,
**Necklaces**, **Chokers**, **Earrings**, **Bracelets**, **Rings**, **Casual**.

**Collections** (a separate cross-cutting filter, not a department): New
Arrivals, Sale, Best Sellers, Ready To Ship, Plus Sizes.

**Cloth / fabric** (a product attribute, shown as circles on the home page):
A-Line, Fishtail, Banarasi, Silk, Velvet, Georgette, Net, Organza.

## Where images live, in plain terms

- **Home page "Curated Collections" tiles** — one photo per sub-category
  (e.g. one for Gharara, one for Jodhpuri Jacket, one for Earrings). If the
  owner says "the picture on the home page for X is wrong", this is what she
  means.
- **Top-level category header** — Women / Men / Kids / Jewellery each have
  ONE larger portrait photo used at the very top of their listing page AND
  on a second home page section. This is a *different* photo from the
  sub-category tiles above — if she says "the whole Men page photo, not a
  specific item", it's this one.
- **Sub-category listing header** — when a shopper drills into a specific
  sub-category (e.g. Women → Lehengas → Partywear Lehengas), that page shows
  its own small framed photo, usually the same one as the matching home page
  tile.
- **Decorative department banners** (Women/Men/Kids/Jewellery listing pages
  only) — a wide embroidery-style background image behind the header text.
  This is separate again from the tile and portrait photos above.
- **Product photos** — the actual photos of a specific product for sale, set
  per-product in the admin panel, not part of any of the above.

When the owner reports an image problem, the single most useful thing she can
give is: **the exact page (or a screenshot of it) and which photo on that page
is wrong** — because several different images can appear on what looks like
"the same" page.

## Known content gaps (things she may ask about that are genuinely missing, not broken)

- **Chokers** (Jewellery) has no dedicated photo yet — still on a placeholder.
- Some products have no photos of their own; a handful of cloths (A-Line,
  Fishtail, Banarasi, Velvet) currently have no products tagged with them at
  all, so their home page circle won't appear until products exist for them.
