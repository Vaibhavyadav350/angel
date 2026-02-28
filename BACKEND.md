# Backend Documentation — Angel Fashion Studio

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | v14+ | Runtime |
| Express.js | 4.17.2 | HTTP server & routing |
| MongoDB | Atlas | Database |
| Mongoose | 6.1.4 | ODM |
| JSON Web Token (JWT) | 9.x | Admin authentication |
| Bcrypt.js | 2.4.3 | Password hashing |
| Stripe | 8.195.0 | Payment processing |
| Cloudinary | 1.28.1 | Image storage |
| Nodemon | 2.0.15 | Dev auto-restart |
| dotenv | 10.x | Environment variables |

---

## Project Structure

```
backend/
├── server.js              # Entry point
├── package.json
├── .env                   # Environment variables (not committed)
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary config
├── models/
│   ├── productModel.js    # Product schema
│   ├── orderModel.js      # Order schema
│   └── adminModel.js      # Admin schema + JWT/bcrypt methods
├── controllers/
│   ├── productController.js
│   ├── orderController.js
│   ├── adminController.js
│   ├── paymentController.js
│   └── uploadController.js
├── routes/
│   ├── productRouter.js
│   ├── orderRouter.js
│   ├── adminRouter.js
│   ├── paymentRouter.js
│   └── uploadRouter.js
├── middleware/
│   ├── Auth.js            # JWT auth + privilege check
│   └── Error.js           # Global error handler
└── utils/                 # Helper utilities
```

---

## Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default: `5000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRE` | JWT expiry duration (e.g. `7d`) |
| `COOKIE_EXPIRE` | Cookie expiry in days |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_CURRENCY` | Currency for Stripe (e.g. `aud`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_FOLDER` | Cloudinary storage folder name |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowed origins |

---

## How to Run

```bash
cd backend
npm install
npm start
```

Server starts at `http://localhost:5000`

> **Note:** If using `mongodb+srv://` and your router blocks DNS SRV records, use the direct shard connection string format instead.

---

## Database Schema

### Product
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Required |
| `price` | Number | Required, max 99,999,999 |
| `rating` | Number | Default 0 |
| `images` | Array | `{ public_id, url }` from Cloudinary |
| `colors` | Array of String | Required |
| `sizes` | Array of String | Required |
| `company` | String | Required |
| `category` | String | Required |
| `stock` | Number | 0–9999, default 1 |
| `numberOfReviews` | Number | Default 0 |
| `reviews` | Array | `{ name, email, rating, comment }` |
| `shipping` | Boolean | Default true |
| `featured` | Boolean | Default false |
| `admin` | ObjectId | Ref to Admin |
| `createdAt` | Date | Auto |

### Order
| Field | Type | Notes |
|---|---|---|
| `shippingInfo` | Object | `{ address, city, state, country, pinCode, phoneNumber }` |
| `orderItems` | Array | `{ name, price, quantity, image, color, size, product }` |
| `user` | Object | `{ name, email, userId }` — from Firebase auth |
| `paymentInfo` | Object | `{ id, status }` — from Stripe |
| `paidAt` | Date | Required |
| `itemsPrice` | Number | Default 0 |
| `taxPrice` | Number | Default 0 |
| `shippingPrice` | Number | Default 0 |
| `totalPrice` | Number | Default 0 |
| `orderStatus` | String | Default `processing` |
| `deliveredAt` | Date | Optional |

### Admin
| Field | Type | Notes |
|---|---|---|
| `name` | String | 4–30 chars, required |
| `email` | String | Unique, validated |
| `privilege` | String | `super`, `moderate`, or `low` (default `low`) |
| `password` | String | Min 8 chars, bcrypt hashed, hidden from queries |

---

## Authentication & Middleware

- **JWT** is stored in an HTTP-only cookie upon admin login.
- **`Auth.checkUserAuthentication`** — verifies the JWT cookie.
- **`Auth.checkAdminPrivileges(...roles)`** — restricts routes to specific privilege levels:
  - `super` — full access
  - `moderate` — product & order management
  - `low` — read-only order access
