# Environment Variables

> Never commit `.env` files or paste tokens/passwords into chats or screenshots. Values below are **descriptions**, not secrets.

## Backend (`backend/.env`)

### Core
| Variable | Example / value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | |
| `PORT` | `5000` | Node listen port (behind the reverse proxy) |
| `MONGODB_URI` | `mongodb+srv://…` | MongoDB Atlas. Droplet IP must be allow-listed in Atlas. |
| `JWT_SECRET` | (random string) | Signs admin JWTs |
| `JWT_EXPIRE` / `COOKIE_EXPIRE` | e.g. `7d` / `7` | Admin session length |

### URLs & CORS
| Variable | Value | Notes |
|---|---|---|
| `FRONTEND_PUBLIC_URL` | `https://www.angelfashionstudio.org` | **Customer URL** used for payment redirects + email links. Use `www`. |
| `ALLOWED_ORIGINS` | `https://www.angelfashionstudio.org,https://angelfashionstudio.org,https://admin.angelfashionstudio.org` | Comma-separated CORS allow-list. (localhost can be included for dev.) |
| `BACKEND_PUBLIC_URL` | `https://prod-api.angelfashionstudio.org` | Used to build eWAY callback URLs |
| `FRONTEND_URL` | *(deprecated)* | Old var; the code now uses `FRONTEND_PUBLIC_URL`. Safe to delete after deploy. |

### Payments (eWAY)
| Variable | Value | Notes |
|---|---|---|
| `EWAY_API_KEY` | (eWAY API key) | |
| `EWAY_PASSWORD` | (eWAY password) | |
| `EWAY_ENDPOINT` | `Sandbox` or `Production` | The `eway-rapid` SDK expects this **word**, not a URL. `Production` = real money. |

### Images (Cloudinary)
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`.

### Email (ZeptoMail)
| Variable | Value | Notes |
|---|---|---|
| `ZEPTOMAIL_TOKEN` | (Send-Mail token) | Paste **only** the key — the code adds the `Zoho-enczapikey ` prefix. No quotes. |
| `ZEPTOMAIL_API_URL` | *(optional)* `https://api.zeptomail.in/v1.1/email` | Default is `.in` (India DC). Set to `.com` only if your ZeptoMail account is global. |
| `ZOHO_EMAIL_USER` | `support@angelfashionstudio.org` | Used as the **From** address (must be on a ZeptoMail-verified domain) |
| `ZOHO_EMAIL_PASS` | *(deprecated)* | Old Zoho SMTP password — unused since the ZeptoMail switch. Can delete. |

## Frontend (`frontend/.env` / Vercel env)

> All `REACT_APP_*` vars are **build-time** — changing them requires a **rebuild/redeploy** on Vercel.

| Variable | Value | Notes |
|---|---|---|
| `REACT_APP_BACKEND_HOST` | `https://prod-api.angelfashionstudio.org` | **https**, no trailing slash. The API base URL. |
| `REACT_APP_FIREBASE_API_KEY` etc. | (Firebase web config) | Customer auth |

## Quick correctness checklist
- `FRONTEND_PUBLIC_URL` = `https://www.angelfashionstudio.org` (not localhost, not apex)
- `REACT_APP_BACKEND_HOST` = `https://…` (not http) → avoids Mixed-Content
- `EWAY_ENDPOINT` = `Sandbox` while testing, `Production` for real sales
- `ZEPTOMAIL_TOKEN` = key **without** the `Zoho-enczapikey ` prefix
- `ALLOWED_ORIGINS` contains your real storefront + admin domains
