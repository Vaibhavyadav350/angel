# Frontend Documentation — Angel Fashion Studio

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 17.0.1 | UI framework |
| React Router | 5.2.0 | Client-side routing |
| Styled Components | 5.2.1 | CSS-in-JS styling |
| Firebase | 9.6.1 | Customer authentication (email + Google) |
| Stripe.js | 8.130.0 | Checkout/payment UI |
| Chakra UI | 1.8.9 | Admin panel components |
| Axios | 0.21.4 | HTTP client (admin actions) |
| React Toastify | 8.1.0 | Customer-facing toast notifications |
| React Image Magnify | 2.7.4 | Product image hover-to-zoom |
| GSAP | Latest | Scroll-triggered animations |
| Tailwind CSS | (custom) | Archive/landing page layout |

---

## How to Run

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

> `--legacy-peer-deps` is required due to `react-image-magnify` requiring React 16 as a peer dependency.

App opens at `http://localhost:3000`

---

## Project Structure

```
frontend/src/
├── App.js                       # Root component + all route definitions
├── index.js                     # ReactDOM entry
├── index.css                    # Global base styles
├── tailwind.css                 # Tailwind CSS imports (archive components)
├── actions.js                   # Customer API action creators
├── actions_admin.js             # Admin API action creators (Axios)
├── assets/
│   ├── hero-bcg.jpeg            # Used in AboutPage
│   └── logo.svg                 # Used in admin login
├── pages/
│   ├── HomePage/                # Landing page (Archive design)
│   ├── ProductsPage/            # Product listing
│   ├── SingleProductPage/       # Product detail
│   ├── CartPage/                # Shopping cart
│   ├── CheckoutPage/            # Two-step checkout (shipping → payment)
│   ├── OrdersPage/              # Customer order history
│   ├── LoginPage/               # Firebase email + Google sign-in
│   ├── RegisterPage/            # Firebase email + Google sign-up
│   ├── ProfilePage/             # Display name, photo, password management
│   ├── AboutPage/               # Brand story page
│   ├── ForgotPasswordPage/      # Password reset email form
│   ├── ResetPasswordPage/       # Firebase reset password
│   ├── ErrorPage/               # 404 fallback
│   ├── PrivateRoute/            # Customer auth guard
│   └── admin/                   # All admin panel pages
│       ├── LoginPage.js
│       ├── Dashboard.js
│       ├── OrdersPage.js
│       ├── SingleOrderPage.js
│       ├── ProductsPage.js
│       ├── AdminsPage.js
│       ├── PrivateRoute.js      # Admin auth guard
│       └── AdminPrivateRoute.js # Privilege-level guard
├── components/                  # Reusable UI components
├── context/                     # React Context API providers
├── hooks/                       # Custom hooks (useMounted, etc.)
├── reducers/                    # State reducers
├── utils/                       # Constants, helper functions
└── config/                      # Firebase config, Stripe config
```

---

## Customer Pages

---

### `HomePage` — `/`

**File:** `pages/HomePage/index.js`  
**Title:** `Angel Fashion Studio | Home`  
**Auth Required:** No

The editorial landing page built with the "Archive" premium design system.

**Sections (in order):**

| Component | Description |
|---|---|
| `<Hero />` | Full-screen hero with dramatic ANGEL ARCHIVE headline |
| `<CinematicJourney />` | GSAP scroll-animated cinematic section |
| `<MarqueeBanner />` | Infinite looping horizontal text marquee |
| `<BrandPhilosophy />` | Editorial brand mission section |
| `<ProductCollection />` | Filterable product grid pulled from context |
| `<WeaversChronicles />` | Brand storytelling editorial section |
| `<EleganceSection />` | Visual editorial with imagery |
| `<ShopTheLook />` | Curated look/outfit section |
| `<Newsletter />` | Email signup form |

**Context used:** None directly (child components use `products_context`)

---

### `ProductsPage` — `/products`

**File:** `pages/ProductsPage/index.js`  
**Title:** `Angel Fashion Studio | Products`  
**Auth Required:** No

Product listing page with sidebar filters and a sort bar.

**Layout:** Two-column grid — `200px` sidebar + full-width main content area.

| Component | Description |
|---|---|
| `<ArchivePageHero title="products" />` | Dark hero banner with page title |
| `<Filters />` | Sidebar filters (category, price, etc.) from `products_context` |
| `<Sort />` | Sort bar (A-Z, Z-A, price high/low) |
| `<ProductList />` | Paginated grid of `<ProductCard />` items |

**Context used:** `products_context`

---

### `SingleProductPage` — `/products/:id`

**File:** `pages/SingleProductPage/index.js`  
**Title:** `Angel Fashion Studio | {product name}`  
**Auth Required:** No

Full product detail page. Fetches product by `:id` URL param via `fetchSingleProduct`.

**State from context (`products_context`):**
- `single_product_loading` — shows `<Loading />` spinner
- `single_product_error` — shows "Product not found" with back link
- `single_product` — the full product object

**Layout:** Two-column grid (images left, info right).

| Component / Element | Description |
|---|---|
| `<ArchivePageHero title={name} product />` | Page hero with product name |
| Back / Back to products buttons | `history.goBack()` and `/products` link |
| `<ProductImages images={images} />` | Image gallery with `react-image-magnify` zoom |
| Product name, star rating, price | Displayed from API data |
| Stock status | "In stock" or "Out of stock" based on `stock > 0` |
| SKU, Brand | Displayed from `_id` and `company` fields |
| `<AddToCart product={product} />` | Color/size selector + Add to cart (only if `stock > 0`) |
| `<ReviewModal product={product} />` | Button that opens the leave-a-review modal |
| `<UserReview />` (mapped) | Each review rendered as a card |

**Error state:** Shows "Product not found" + "Back to products" link when product has no `_id`.

---

### `CartPage` — `/cart`

**File:** `pages/CartPage/index.js`  
**Title:** `Angel Fashion Studio | Cart`  
**Auth Required:** No

**Empty state:** Shows "Your cart is empty" with a "Fill it" link to `/products`.

**Loaded state:** Renders `<CartContent />` with all cart items, quantities, and totals.

| Component | Description |
|---|---|
| `<ArchivePageHero title="cart" />` | Page hero |
| `<CartContent />` | Full cart table (item, price, quantity, subtotal, totals, checkout button) |

**Context used:** `cart_context` (`cart` array)

---

### `CheckoutPage` — `/checkout`

**File:** `pages/CheckoutPage/index.js`  
**Title:** `Angel Fashion Studio | Checkout`  
**Auth Required:** No (but cart must not be empty)

Two-step checkout flow:

| Step | Condition | Renders |
|---|---|---|
| Step 1 — Shipping | `editingShipping === true` (default, or any shipping fields are empty) | `<ShippingForm confirmShipping={confirmShipping} />` |
| Step 2 — Payment | `editingShipping === false` and cart is not empty | `<StripeCheckout />` |
| Empty cart | Cart has 0 items on Step 2 | "Your cart is empty" with "Fill it" link |

**Logic:** On mount, checks if shipping info fields (name, address, city, state, country, postal_code) are all filled via `checkObjectProperties`. If any are missing, stays on Step 1.

**Context used:** `order_context` (shipping info), `cart_context` (cart)

---

### `OrdersPage` — `/orders`

**File:** `pages/OrdersPage/index.js`  
**Title:** `Angel Fashion Studio | Orders`  
**Auth Required:** Yes (Firebase user must be signed in)

Displays all orders placed by the current user.

| State | Renders |
|---|---|
| `loading === true` | `<Loading />` spinner |
| `error === true` | `<Error />` component |
| `orders.length < 1` | "You have no orders" + "Buy" link to `/products` |
| Orders present | List of `<OrderContent />` cards + "Shop more" link |

**Context used:** `order_context` (`orders`, `orders_loading`, `orders_error`)

---

### `LoginPage` — `/login`

**File:** `pages/LoginPage/index.js`  
**Title:** `Angel Fashion Studio | Login`  
**Auth Required:** No

| Field | Type | Validation |
|---|---|---|
| Email | `input[type=email]` | Required |
| Password | `input[type=password]` | Required, toggle visibility |

**Actions:**
- **Email/password login** → `loginUser(email, password)` via Firebase → redirects to `location.state.from` or `/`
- **Google sign-in** → `signInWithGoogle()` → redirects to `/`
- **Links:** "Forgot password?" → `/forgot-password`, "Register" → `/register`

**Error handling:** `react-toastify` toast on validation fail or Firebase error.

**Context used:** `user_context` (`loginUser`, `signInWithGoogle`)

---

### `RegisterPage` — `/register`

**File:** `pages/RegisterPage/index.js`  
**Title:** `Angel Fashion Studio | Register`  
**Auth Required:** No

| Field | Type | Validation |
|---|---|---|
| Email | `input[type=email]` | Required |
| Password | `input[type=password]` | Required, toggle visibility |
| Confirm Password | `input[type=password]` | Must match password, toggle visibility |

**Actions:**
- **Register** → `registerUser(email, password)` via Firebase → redirects to `/`
- **Google sign-in** → `signInWithGoogle()` → redirects to `/`
- **Link:** "Login" → `/login`

**Context used:** `user_context` (`registerUser`, `signInWithGoogle`)

---

### `ProfilePage` — `/profile`

**File:** `pages/ProfilePage/index.js`  
**Title:** `Angel Fashion Studio | Profile`  
**Auth Required:** Yes

Three sections for managing the Firebase user account:

#### 1. Profile Photo
- Displays current `photoURL` from Firebase as a circular avatar
- "Upload new" button opens a hidden `<input type="file" accept="image/*" />`
- On file select: reads as base64 → `uploadProfileImage(image)` (sends to Cloudinary via backend) → `updateUserProfileImage(url)` (updates Firebase `photoURL`)

#### 2. Display Name
- Text input pre-filled with `displayName`
- On submit: `updateUserProfileName(name)` updates Firebase display name

#### 3. Password Change
| Field | Description |
|---|---|
| Current Password | Required for re-authentication via `reauthenticateUser` |
| New Password | Min 6 characters |
| Confirm New Password | Must match new password |

- On submit: calls `reauthenticateUser(existingPassword)` → `updateUserProfilePassword(confirmNewPassword)`

**Bottom actions:**
- "Orders" → links to `/orders`
- "Logout" → calls `clearCart()` + `logoutUser()` + `closeSidebar()`

**Context used:** `user_context`, `cart_context`, `products_context`

---

### `AboutPage` — `/about`

**File:** `pages/AboutPage/index.js`  
**Title:** `Angel Fashion Studio | About`  
**Auth Required:** No

Two-column layout (image left, article right).

- **Image:** `assets/hero-bcg.jpeg` at `500px` height
- **Content:** Brand story — Melbourne-based fashion retailer, address at 32/150 Palmers Road, Truganina VIC 3029

---

### `ForgotPasswordPage` — `/forgot-password`

**File:** `pages/ForgotPasswordPage/index.js`  
**Title:** `Angel Fashion Studio | Forgot Password`  
**Auth Required:** No

Single email input form. Calls `forgotPassword(email)` (Firebase `sendPasswordResetEmail`). On success shows a toast: "A password reset link has been sent". Links back to `/login`.

**Context used:** `user_context` (`forgotPassword`)

---

### `ErrorPage` — `*` (catch-all)

**File:** `pages/ErrorPage/index.js`  
**Title:** —  
**Auth Required:** No

Default 404 / route-not-found fallback page. Shown for any unmatched URL.

---

### `PrivateRoute` (Customer)

**File:** `pages/PrivateRoute/index.js`  
Guards customer-only routes (e.g., `/orders`, `/profile`). If user is not signed in via Firebase, redirects to `/login` and stores the attempted route in `location.state.from` so the user is redirected back after login.

---

## Admin Pages

All admin pages are wrapped in `<SidebarWithHeader>` (Chakra UI shell with a collapsible sidebar and a top header). UI uses Chakra UI components.

---

### `admin/LoginPage` — `/admin/login`

**File:** `pages/admin/LoginPage.js`  
**Auth Required:** No (public)

Chakra UI form with Email + Password fields. Logo displayed at top.

- Calls `loginAdmin(email, password)` from `admin_context`
- Uses Chakra UI `useToast` for success/error feedback (not `react-toastify`)
- Shows `<PreLoader />` spinner while `adminAuthLoading === true`

**Context used:** `admin_context` (`loginAdmin`, `adminAuthLoading`)

---

### `admin/Dashboard` — `/admin`

**File:** `pages/admin/Dashboard.js`  
**Auth Required:** Any admin level

| Component | Description |
|---|---|
| `<DashboardCards />` | Summary stat cards (total orders, revenue, etc.) |
| `<OrdersTable orders={recent_orders} />` | Table of the most recent orders |

**Context used:** `admin_order_context` (`recent_orders`)

---

### `admin/OrdersPage` — `/admin/orders`

**File:** `pages/admin/OrdersPage.js`  
**Auth Required:** `low`, `moderate`, or `super`

| State | Renders |
|---|---|
| `loading` | `<Spinner />` inside `<SidebarWithHeader>` |
| `error` | Error heading inside `<SidebarWithHeader>` |
| Loaded | `<OrdersTable orders={orders} />` |

Has a **Refresh** button that re-calls `fetchOrders()`.

**Context used:** `admin_order_context`

---

### `admin/SingleOrderPage` — `/admin/order/:id`

**File:** `pages/admin/SingleOrderPage.js`  
**Auth Required:** Any admin level

Fetches the order by `:id` param on mount via `fetchSingleOrder(id)`.

**Status update selector logic:**
| Current Status | Available Transitions |
|---|---|
| `processing` or `rejected` | processing, confirmed, rejected only |
| `confirmed` | confirmed, shipped, delivered, rejected |
| `shipped` | shipped, delivered |
| `delivered` | delivered only |

On `<Select>` change → calls `updateOrderStatus(status, id)` → API PUT request → success/error toast.

Shows `<OrderDetails />` with full order info (items, shipping address, payment info).

**Context used:** `admin_order_context`

---

### `admin/ProductsPage` — `/admin/products`

**File:** `pages/admin/ProductsPage.js`  
**Auth Required:** `moderate` or `super`

| State | Renders |
|---|---|
| `loading` | Spinner |
| `error` | Error heading |
| Loaded | `<ProductsTable products={products} />` |

- **Create New Product** button opens `<CreateNewProductModal />` — a Chakra UI modal form to create a product (name, description, price, category, sizes, colors, stock, images via Cloudinary upload)
- **Refresh** button re-calls `fetchProducts()`

**Context used:** `admin_product_context`

---

### `admin/AdminsPage` — `/admin/users`

**File:** `pages/admin/AdminsPage.js`  
**Auth Required:** `super` only

| State | Renders |
|---|---|
| `loading` | Spinner |
| `error` | Error heading |
| Loaded | `<AdminsTable admins={admins} />` |

- **Create New Admin** button opens `<CreateNewAdminModal />` — form with name, email, password, privilege level
- **Refresh** button re-calls `fetchAdmins()`
- Table rows allow updating privilege and deleting admins

**Context used:** `admin_context` (`admins`, `admins_loading`, `admins_error`, `fetchAdmins`)

---

## Key Patterns

| Pattern | Detail |
|---|---|
| **Auth (Customer)** | Firebase Authentication — email/password + Google OAuth. `user_context` exposes `currentUser`, `loginUser`, `registerUser`, `logoutUser`, `signInWithGoogle` |
| **Auth (Admin)** | JWT cookie set by backend. `admin_context` exposes `loginAdmin`, `currentAdmin`, `adminAuthLoading` |
| **State Management** | React Context API + reducers (no Redux). Separate contexts for: products, cart, orders, user, admin, admin products, admin orders |
| **API Calls** | Customer pages use action creators in `actions.js`. Admin pages use Axios in `actions_admin.js` pointing to `http://localhost:5000/api` |
| **Styling** | Customer UI → Styled Components + Tailwind. Admin UI → Chakra UI |
| **Notifications** | Customer → `react-toastify`. Admin → Chakra UI `useToast` |
| **Private Routes** | `PrivateRoute` (customer Firebase guard), `AdminPrivateRoute` (admin JWT guard) |
| **Error Boundaries** | Each page handles loading/error states locally via context flags |
