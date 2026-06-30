# Architecture

## Monorepo layout

```
angel/
├── frontend/                 # React app (storefront + admin in one build) → Vercel
│   └── src/
│       ├── pages/            # customer pages + pages/admin/ (admin panel)
│       ├── components/       # customer components + components/admin/
│       ├── context/          # React Context providers (state)
│       ├── reducers/         # useReducer logic for contexts
│       └── utils/            # pricing.js, constants.js, helpers.js, taxonomy.json, categoryData.js
├── backend/                  # Node/Express REST API → DigitalOcean droplet (pm2)
│   ├── server.js             # entry point (CORS, helmet, routers, DB connect)
│   ├── config/               # db.js, cloudinary.js
│   ├── models/               # Mongoose schemas
│   ├── controllers/
│   ├── routes/
│   ├── services/             # orderService, pricingService, pdfService, reconciliationService
│   ├── middleware/           # Auth.js, Error.js, CatchAsyncErrors.js
│   └── utils/                # emailService.js (ZeptoMail), jwt, ErrorHandler
└── docs/                     # ← this folder
```

## One React app, two faces

A **single Vercel deployment** serves both the storefront and the admin panel. `App.js` decides which router to mount based on the hostname/path:

```js
(window.location.hostname.startsWith('admin.') || window.location.pathname.startsWith('/admin'))
  ? <AdminRoutes />     // admin.angelfashionstudio.org  OR  /admin/*
  : <CustomerRoutes />  // everything else
```

So `admin.angelfashionstudio.org` and `www.angelfashionstudio.org/admin` both load the admin panel; the customer storefront is everything else. Both domains point to the same Vercel project (see [domains-dns.md](domains-dns.md)).

## Tech stack

**Frontend:** React 17, React Router 5, Tailwind CSS (flat brand colours — `bronze`/`champagne`/`gold`, never numbered scales), Firebase Auth (customer login + Google), GSAP & Framer Motion (animations), Recharts (admin charts), axios.

**Backend:** Node.js + Express 4, Mongoose 6 (MongoDB Atlas), JWT in HTTP-only cookie (admin auth), bcrypt, helmet, express-rate-limit, express-mongo-sanitize, `eway-rapid` (payments), `cloudinary`, `pdfkit` + `qrcode` (invoices), `xlsx` (exports).

## Request / data flow

```
Customer browser ──HTTPS──▶ Vercel (React static)
        │
        └── API calls (REST) ──HTTPS──▶ prod-api.angelfashionstudio.org
                                          (DigitalOcean droplet, Node :5000, pm2)
                                                 │
                                                 ├──▶ MongoDB Atlas (data)
                                                 ├──▶ Cloudinary (images)
                                                 ├──▶ eWAY Rapid (payments, hosted page)
                                                 └──▶ ZeptoMail HTTPS API (email)
```

- **Customer auth:** Firebase (client-side). The backend trusts a `userId`/email passed from the client for non-sensitive reads; orders are tied to the email captured at checkout.
- **Admin auth:** server-side JWT in an HTTP-only cookie. Middleware `Auth.checkUserAuthentication` verifies the cookie; `Auth.checkAdminPrivileges(...roles)` gates routes by privilege (`super` > `moderate` > `low`).

## Key data models (MongoDB)

### Product (`models/productModel.js`)
- `name`, `description`, `price` (RRP, AUD, GST-inclusive), `discountPercent` (per-product markdown), `company` (brand)
- `category`, `subCategory`, `productType`, `collections[]` — validated against `frontend/src/utils/taxonomy.json` (shared FE/BE; collections are **lowercase** enum values)
- **`variants[]`**: `{ size, color, stock, sku }` — the true inventory matrix
- `stock`: global = **sum of variant stocks** (kept in sync; see [payments-and-pricing.md](payments-and-pricing.md#inventory))
- `images[]` (`{ public_id, url }` from Cloudinary), `colors[]`, `sizes[]`
- `featured`, `isTrending`, `badgeText`, `leadTimeDays`, `composition`, `careInstructions`
- `reviews[]`, `rating`, `numberOfReviews`

### Order (`models/orderModel.js`)
- `shippingInfo` `{ address, city, state, country, pinCode, phoneNumber, trackingNumber, carrier }`
- `orderItems[]` `{ name, price (selling, what they paid), mrp (RRP), quantity, image, color, size, product }`
- `user` `{ name, email, userId }`
- `paymentInfo` `{ id (eWAY TransactionID, unique), status }`
- `itemsPrice` (selling subtotal), `taxPrice` (GST included), `shippingPrice`, `totalPrice`, `discountAmount` (coupon), `couponCode`, `addOns[]` `{ name, price }`
- `orderStatus` (`processing`→`confirmed`→`shipped`→`delivered`, or `rejected`/`cancelled`), `returnStatus`, `deliveredAt`, `createdAt`

### Admin (`models/adminModel.js`)
- `name`, `email`, `password` (bcrypt, hidden), `privilege` (`super`/`moderate`/`low`)

### Settings (`models/settingsModel.js`) — single document, store-wide config
- `standardShippingPrice` (15), `expressShippingPrice` (65), `expressEnabled`, `freeShippingThreshold` (0 = off)
- `gstRate` (10)
- `hemmingPrice`, `giftBoxPrice`, `petticoatPrice` (add-on services), `announcementText`

### Others
`Coupon`, `Banner`, `FeaturedCollection`, `Category`, `Newsletter`, `Testimonial`, `Restock` subscription, `PendingCheckout`, `UserProfile` (wishlist + spend).

## Important shared modules

- **`frontend/src/utils/pricing.js`** — the single source of truth for money math on the client (selling price, shipping methods, GST, the full itemised order summary). See [payments-and-pricing.md](payments-and-pricing.md).
- **`backend/services/pricingService.js`** — the **authoritative** pricing used to actually charge the customer (recomputes from the DB, never trusts the browser).
- **`frontend/src/utils/taxonomy.json`** — categories, subcategories, and collections; `require`d by the backend product model too, so FE and BE validate against the same list.
