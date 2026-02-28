# Feature List — Angel Fashion Studio

## Customer Features

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1 | User Registration | Email/password sign-up via Firebase | ✅ |
| 2 | Google Sign-In | One-click authentication with Google Account | ✅ |
| 3 | Product Browsing | Browse all products with infinite/paginated listing | ✅ |
| 4 | Category Filtering | Filter products by category (Men's, Women's, Kids, etc.) | ✅ |
| 5 | Keyword Search | Search products by name | ✅ |
| 6 | Product Detail Page | Full product page with description, images, size & color options | ✅ |
| 7 | Image Zoom | Hover-to-magnify product images (react-image-magnify) | ✅ |
| 8 | Size & Color Selection | Choose size and color before adding to cart | ✅ |
| 9 | Shopping Cart | Add, remove, update quantity of items in cart | ✅ |
| 10 | Cart Persistence | Cart state persisted via React Context | ✅ |
| 11 | Stripe Checkout | Secure payment via Stripe Payment Intent | ✅ |
| 12 | Order Placement | Full checkout flow — shipping info, payment, confirmation | ✅ |
| 13 | Order History | View past orders by signed-in user | ✅ |
| 14 | Single Order View | View details of a specific order | ✅ |
| 15 | Product Reviews | Leave a star rating and comment on products | ✅ |
| 16 | Review Listing | View all reviews on a product detail page | ✅ |
| 17 | Responsive Design | Fully responsive: desktop, tablet, and mobile | ✅ |
| 18 | Premium Landing Page | "Archive" editorial landing page with GSAP animations | ✅ |
| 19 | Marquee Banner | Infinite scrolling brand text banner | ✅ |
| 20 | Newsletter Signup | Email signup form on landing page | ✅ |
| 21 | Coupon Application | Redeem discount codes during checkout | ✅ |
| 22 | Archival Return Flow | Multi-step request system for delivered orders | ✅ |
| 23 | Heritage Pricing | Standardized AUD ($) pricing across all touchpoints | ✅ |

---

## Commercial & Administrative Features

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1 | Sales Analytics | Interactive charts for revenue and category trends | ✅ |
| 2 | KPI Dashboard | Real-time stats for AOV, Gross Revenue, and Sales | ✅ |
| 3 | Coupon Engine | Full management of promotion codes (Fixed/%) | ✅ |
| 4 | PDF Invoicing | Automated invoice generation and download | ✅ |
| 5 | Order Filtering | Advanced search by status, date, and price | ✅ |
| 6 | Return Management | Approve/Reject returns with status pulse indicators | ✅ |
| 7 | Regional Heritage | Localized addresses, policies, and narrative for Australia | ✅ |

## Admin Panel Features

| # | Feature | Description | Privilege Required |
|---|---------|-------------|-------------------|
| 1 | Admin Login | Secure JWT-based login | Public |
| 2 | Admin Logout | Clears JWT cookie | Any Admin |
| 3 | Dashboard | Overview panel | Any Admin |
| 4 | View All Orders | List of all customer orders | `low`, `moderate`, `super` |
| 5 | View Single Order | Full order details | `low`, `moderate`, `super` |
| 6 | Update Order Status | Change order status (processing → shipped → delivered) | `low`, `moderate`, `super` |
| 7 | Delete Order | Remove an order | `moderate`, `super` |
| 8 | Create Product | Add a new product with images, sizes, colors | `moderate`, `super` |
| 9 | Update Product | Edit existing product details | `moderate`, `super` |
| 10 | Delete Product | Remove a product from the store | `moderate`, `super` |
| 11 | Delete Review | Remove a customer review from a product | `moderate`, `super` |
| 12 | Image Upload | Upload product images to Cloudinary | `moderate`, `super` |
| 13 | View All Admins | List all admin accounts | `super` |
| 14 | Register Admin | Create a new admin with a privilege level | `super` |
| 15 | Update Admin Privilege | Change a user's privilege level | `super` |
| 16 | Delete Admin | Remove an admin account | `super` |

---

## Infrastructure & Tech Features

| # | Feature | Technology | Description |
|---|---------|-----------|-------------|
| 1 | Cloud Database | MongoDB Atlas | Fully managed cloud NoSQL database |
| 2 | Image CDN | Cloudinary | Product images stored and served via CDN |
| 3 | Payments | Stripe | PCI-compliant payment processing |
| 4 | Customer Auth | Firebase | Managed auth with Google OAuth support |
| 5 | Admin Auth | JWT + Bcrypt | Stateless JWT with hashed passwords |
| 6 | CORS Protection | Express CORS | Whitelist-based origin control |
| 7 | Three-Tier Access Control | Custom Middleware | `super`, `moderate`, `low` privilege roles |
| 8 | Dev Hot Reload | Nodemon | Backend auto-restarts on file changes |
| 9 | Error Handling | Global Middleware | Centralized error response format |
| 10 | Animations | GSAP | Scroll-triggered GPU-accelerated animations |
