# Angel Fashion Studio — New Landing Page Blueprint

## Design Tokens (Global)
| Token | Value |
|---|---|
| Background | `#F5EFE4` (champagne) |
| Primary Text | `#2C1810` (dark chocolate) |
| Accent Gold | `#C9A96E` |
| Deep Brown | `#6B3E2A` |
| White | `#FFFFFF` |
| Font - Heading | Editorial serif (Playfair Display / Cormorant Garamond) |
| Font - Body | Clean sans-serif (Inter / DM Sans) |
| Border Radius | Cards: 12px, Pills: 9999px, Arched cards: arch-shape clip-path |
| Transition | 300ms ease |

---

## Section-by-Section Blueprint

---

### SECTION 1 — STICKY NAVIGATION BAR

| Property | Detail |
|---|---|
| **Height** | 64px desktop / 56px mobile |
| **Position** | Fixed top, z-index 100, background blurs on scroll (`backdrop-filter: blur(12px)`) |
| **Left** | Logo — "ANGEL" wordmark + "FASHION STUDIO" subtitle in tiny caps |
| **Center (Desktop)** | Nav links: `WOMEN ▾` `MEN ▾` `KIDS` `JEWELRY` `SALE` `HERITAGE` |
| **Right (Desktop)** | 🔍 Search icon \| ♡ Wishlist \| 🛒 Cart (with item count badge) \| `LOGIN` |
| **Dropdown (hover)** | Mega-menu panel drops down. Women → 3 columns: Salwar Kameez \| Sarees \| Lehengas. Men → Sherwanis \| Jackets \| Kurtas. Smooth fade-down animation |
| **Tablet** | Logo left. Icons right (search, cart, hamburger). No text nav links |
| **Mobile** | Logo left. Cart icon + Hamburger right. No center links |
| **Mobile Hamburger** | Full-screen slide-in drawer from left. Shows all categories with accordions. "Women ▸ → expands to sub-items" |
| **Sale link style** | Red/crimson colored text to stand out |
| **Scroll behavior** | Transparent on hero → solid champagne background after 80px scroll |
| **UI Component** | Standard HTML navbar + CSS backdrop-filter + JS dropdown |

---

### SECTION 2 — HERO BANNER

| Property | Detail |
|---|---|
| **Height** | `100vh` (full viewport, fits exactly one screen) |
| **Layout** | Full-bleed editorial image as background. Dark gradient overlay bottom-to-top. Text bottom-left aligned |
| **Image** | High-quality bridal editorial photo (current hero images work great) |
| **Carousel** | Max 2 slides (Bridal + Men's). Auto-play 5s. Simple dot indicators bottom-center |
| **Headline style** | Huge serif font `(80-100px desktop, 42px mobile)`. White text. Example: "THE BRIDAL EDIT" |
| **Sub-headline** | Tiny caps, gold color, above headline. Example: "HAUTE COUTURE" |
| **CTA Button** | Outlined white button. `SHOP COLLECTION →`. On hover: fills white, text turns brown |
| **Desktop layout** | Text left-aligned, bottom 20% of screen |
| **Mobile layout** | Text center-aligned, image zoomed to portrait aspect. Smaller text |
| **Tablet layout** | Same as desktop but slightly smaller text |
| **Transition effect** | Cross-fade between slides (not slide push) |
| **UI Component** | CSS-only or minimal JS carousel. No heavy libraries |

---

### SECTION 3 — CATEGORY QUICK LINKS (Below hero)

| Property | Detail |
|---|---|
| **Height** | 120px total — this is a STRIP, not a section |
| **Purpose** | Users pick gender/category immediately after hero. Highest conversion importance |
| **Layout Desktop** | Single horizontal row, centered. 8 items with equal spacing |
| **Layout Mobile** | Horizontal scroll (scrollbar hidden). Items don't wrap |
| **Item shape** | **Rounded pill buttons** (not circles). Icon + label. Example: `👗 Lehengas` |
| **Items** | `New Arrivals` \| `Lehengas` \| `Sarees` \| `Salwar Kameez` \| `Sherwanis` \| `Kids` \| `Jewelry` \| `🔥 Sale` |
| **Pill style** | Border: 1px solid `#C9A96E`. Background: transparent. Text: chocolate. On hover: gold fill |
| **Sale pill** | Special styling: red border, red text |
| **Background** | Pure white strip — contrasts with champagne page background |
| **Spacing** | 24px padding top/bottom, gap-3 between pills |
| **UI Component** | `<div class="overflow-x-auto flex gap-3">` with pill anchor tags |

---

### SECTION 4 — FEATURED COLLECTION (Bridal / New Arrivals)

| Property | Detail |
|---|---|
| **Height** | `90vh` desktop / auto tablet / auto mobile |
| **Purpose** | Showcase one hero collection WITH actual products + prices |
| **Desktop Layout** | 40% left: big editorial image. 60% right: Section title + 2x2 product card grid |
| **Tablet Layout** | Stack: Image top (50vw height), products below |
| **Mobile Layout** | Same stacking but image is shorter (40vw height), 2-col product grid below |
| **Left image** | Full-height image with slight parallax scroll effect on desktop. No arch shape — clean rectangle with 12px border-radius |
| **Right - Title** | Small label: "HAUTE COUTURE". Big serif heading: "THE BRIDAL EDIT". Short 1-line description. `View All →` link |
| **Product cards (4 cards)** | Card shape: `12px border-radius`. Image top, name below, price below name. Quick-view icon on hover |
| **Card hover** | Image scales to 1.05x, shadow appears |
| **Price style** | Bold, dark. Discount price in red. Original crossed out |
| **Section background** | White — clean contrast to page champagne |
| **UI Component** | CSS Grid 2-col layout. Product cards are standard `<article>` tags |

---

### SECTION 5 — SHOP BY CATEGORY (Compact Grid)

| Property | Detail |
|---|---|
| **Height** | Auto — fits within 1.5 screens max on desktop |
| **Purpose** | Visual entry point to all major categories |
| **Desktop Layout** | 4 columns × 2 rows = 8 category cards |
| **Tablet Layout** | 3 columns × 3 rows |
| **Mobile Layout** | 2 columns × 4 rows |
| **Section title** | Centered. Small label: "EXPLORE OUR WORLD". Big heading: "SHOP BY CATEGORY" |
| **Card shape** | **Arched top (the semi-circle you liked!)** — CSS `clip-path` or `border-radius` trick. Arch at top, straight bottom. Looks like Mughal arch windows |
| **Card size** | 240px wide × 300px tall desktop. 160px × 210px mobile |
| **Card content** | Full image background. Dark gradient overlay bottom. White category name bottom-left. Sub-label example: "Anarkali · Gharara · Palazzo" |
| **Card hover** | Image zooms to 1.08x. Thin gold border appears |
| **Categories shown** | Bridal Lehengas, Pure Silk Sarees, Salwar Kameez, Sherwanis, Anarkali Suits, Jewelry, Kids Collection, Sale |
| **"Sale" card** | Deep red tinted image with "SALE" badge |
| **Background** | Champagne `#F5EFE4` — same as page, no box |
| **UI Component** | CSS Grid + `clip-path: path(...)` for arch shape |

---

### SECTION 6 — NEW ARRIVALS PRODUCT GRID

| Property | Detail |
|---|---|
| **Height** | Auto |
| **Purpose** | Show real shoppable products. This is the CONVERSION section |
| **Desktop Layout** | 4 columns, 2 rows = 8 products. "View All" button below |
| **Tablet Layout** | 3 columns |
| **Mobile Layout** | 2 columns. Horizontal scroll alternative if desired |
| **Filter Chips (top)** | Row of pills: `All` `Women` `Men` `Kids` `Under $500` `Under $1000`. Active chip: gold fill |
| **Product Card** | No arch — clean rectangle. Image 3:4 ratio. Name (1 line ellipsis). Price. "Add to Cart" appears on hover (desktop) or always visible (mobile) |
| **Wishlist icon** | Heart icon top-right of card. Toggle on click |
| **"New" badge** | Small pill badge top-left on new items |
| **"Sale" badge** | Red pill badge top-left on sale items |
| **Section title** | Left-aligned: "NEW ARRIVALS". Right-aligned: `View All →` link |
| **Lazy loading** | Images load as user scrolls in |
| **Background** | White section |
| **UI Component** | CSS Grid, standard product card components |

---

### SECTION 7 — OCCASIONS STRIP

| Property | Detail |
|---|---|
| **Height** | 180px desktop / 150px mobile. ONE row. Not a full section |
| **Purpose** | Secondary navigation path by occasion |
| **Desktop Layout** | 5 cards in a single horizontal row |
| **Mobile Layout** | Horizontal scroll strip |
| **Card shape** | Tall thin rectangle (80px wide × 140px tall). Rotated text label inside (vertical text). Image background |
| **Card label** | Vertical text from bottom to top. "WEDDING EDIT" "MEHNDI CEREMONY" "FESTIVE SEASON" "OFFICE WEAR" "CASUAL DAILY" |
| **Hover** | Card expands slightly, label becomes horizontal |
| **Section label** | Very small text above strip: "SHOP BY OCCASION" |
| **UI Component** | Horizontal flex container with `writing-mode: vertical-rl` for labels |

---

### SECTION 8 — SALE BANNER (Conditional — show only if sale active)

| Property | Detail |
|---|---|
| **Height** | 220px desktop / 160px mobile |
| **Layout** | Full-width banner. Left: text. Right: editorial image. Background: deep brown `#6B3E2A` |
| **Text** | Gold label: "LIMITED TIME". White heading: "UP TO 40% OFF". CTA: Gold outlined button "SHOP SALE" |
| **Image** | Cropped fashion shot, right-aligned, fills right 40% of banner |
| **Mobile** | Text centered, image hidden or shown as background with dark overlay |
| **UI Component** | CSS flex banner. Simple. No animations needed here |

---

### SECTION 9 — TRUST BAR + NEWSLETTER

| Property | Detail |
|---|---|
| **Height** | 80px trust bar + 200px newsletter = 280px total |
| **Trust Bar items** | `✈ Free Shipping on orders over $150` \| `🔄 30-Day Easy Returns` \| `💎 Authentic Handcrafted` \| `📱 WhatsApp Support` |
| **Trust Bar style** | Single horizontal row. Dividers between items. White background. Small icons + text |
| **Mobile trust bar** | 2×2 grid |
| **Newsletter** | Centered. Small heading: "STAY IN THE LOOP". Input field + "SUBSCRIBE" button side by side. "New collections, exclusive offers" subtitle |
| **Background** | Champagne |
| **UI Component** | Flex row for trust bar, inline-flex form for newsletter |

---

### SECTION 10 — FOOTER

| Property | Detail |
|---|---|
| **Layout Desktop** | 4 columns. Col1: Logo + brand description. Col2: Women (all sub-categories). Col3: Men + Kids + Jewelry. Col4: Help + Links |
| **Layout Tablet** | 2×2 columns |
| **Layout Mobile** | Accordion — each column collapses, tap to expand |
| **Sub-categories shown** | This is where ALL your sub-categories live (Gharara, Palazzo, Anarkali, Jodhpuri etc.) |
| **Bottom bar** | © 2025 Angel Fashion Studio \| Privacy Policy \| Terms \| Refund Policy |
| **Social icons** | Instagram, Pinterest, Facebook — icon only |
| **Color** | Dark brown `#2C1810` background. Champagne/gold text |
| **UI Component** | CSS Grid footer. JS accordion for mobile |

---

### MOBILE-ONLY — BOTTOM NAVIGATION BAR

| Property | Detail |
|---|---|
| **Visibility** | Mobile only (`< 768px`). Fixed bottom |
| **Height** | 60px |
| **Items** | 🏠 Home \| 🔍 Search \| ♡ Wishlist \| 🛒 Cart |
| **Active state** | Gold icon + gold text label |
| **Background** | White with thin top border |
| **This replaces** | The need to scroll back to top for navigation on mobile |
| **UI Component** | Fixed positioned nav, `z-index: 200` |

---

## Sections Removed vs Current

| Removed Section | Reason |
|---|---|
| "Heritage in Motion" full-screen video | Nobody watches, massive performance hit |
| Scrolling marquee text strip | Zero conversion value, decorative only |
| "Master Craftsmanship" section | Belongs on About page |
| "Style Intelligence" section | Not relevant to buying journey |
| Festive Archive (standalone section) | Merged into Featured Collection |
| "The Directory" standalone section | Replaced by compact Category Grid (Section 5) |
| Salwar Kameez editorial section | Merged into New Arrivals grid |

---

## Total Sections: 10 (vs current ~15+)

| # | Section | Screen Height (Desktop) | Conversion Priority |
|---|---|---|---|
| 1 | Sticky Nav | 64px | 🔴 Critical |
| 2 | Hero Banner | 100vh | 🟡 Branding |
| 3 | Category Pills | 120px | 🔴 Critical |
| 4 | Featured Collection | ~90vh | 🔴 High |
| 5 | Shop by Category | ~80vh | 🟠 Medium |
| 6 | New Arrivals Grid | ~100vh | 🔴 Critical |
| 7 | Occasions Strip | 180px | 🟡 Secondary |
| 8 | Sale Banner | 220px | 🔴 High (if active) |
| 9 | Trust + Newsletter | 280px | 🟢 Supporting |
| 10 | Footer | ~400px | 🟢 Supporting |
| M | Mobile Bottom Nav | 60px | 🔴 Critical (mobile) |
