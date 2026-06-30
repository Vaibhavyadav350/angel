# Operations Runbook

## Common operations

### Check backend status / logs (on the droplet)
```bash
pm2 list                                   # status, uptime, restart count
pm2 logs angel-backend                      # live tail
pm2 logs angel-backend --err --lines 100    # errors only
pm2 logs angel-backend --lines 1000 --nostream | grep -iE "EMAIL|EWAY|CORS|ERROR"
```
Log files: `~/.pm2/logs/angel-backend-{out,error}.log`.

### Deploy backend changes
```bash
cd /path/to/angel/backend && git pull && npm install
pm2 restart angel-backend --update-env
```
Use `--update-env` whenever `.env` changed.

### Deploy frontend
Push to the connected branch → Vercel auto-builds. After an env change, trigger a redeploy (env vars are build-time).

### DNS changes
Edit at **manage.opensrs.net** → Modify DNS Zone → **Save**. Verify: `nslookup -type=TXT <host>.angelfashionstudio.org 8.8.8.8`. See [domains-dns.md](domains-dns.md).

### Inspect / fix data quickly
A throwaway script in `backend/` (loads `.env`, connects with Mongoose) is the fastest way to inspect products/orders. Delete it after.

## Known issues & fixes (catalogue)

These were all found and fixed; documented so they're not reintroduced.

### Payments / pricing
- **Post-payment redirect went to `http://localhost:3000`.** The redirect read `ALLOWED_ORIGINS.split(',')[0]`, whose first entry is localhost. Now uses `FRONTEND_PUBLIC_URL` (`webhookController`, `server.js`).
- **Backend trusted the browser's total.** Now `pricingService.computeAuthoritativeOrder` recomputes the charge server-side (security + correctness).
- **Same product showed 5 different prices.** Consolidated to `pricing.js` (display) + `pricingService.js` (charge); GST-inclusive, per-product discount, coupons, flat shipping.

### Inventory
- **Stock decremented only the global field, not the variant** → Inventory page never reflected sales, and decrements were wiped on product edit. Now decrements the size+color variant and recomputes global = sum of variants. (After deploying, do a one-time variant recount.)

### Email
- **All email failed (`Connection timeout`)** — DigitalOcean blocks outbound SMTP. Switched to ZeptoMail HTTPS API. See [email.md](email.md).
- **Order-confirmation email totals didn't reconcile** (jumped to grand total with no subtotal/shipping lines). Now itemised to match the invoice.
- **`angelfashion.au` hardcoded** in email/invoice footers + the invoice QR code, but the real domain is `angelfashionstudio.org`. Fixed all occurrences.

### Domains
- **`REACT_APP_BACKEND_HOST` was `http://…`** → Mixed-Content warning. Must be `https://prod-api.angelfashionstudio.org`.
- **`.au` domains** appeared in CORS but the site is `.org` only.

### Admin panel (storefront audit also done)
- Dead "bulk select" / "bulk order status" features removed.
- Actions dropdown opened off-screen after scrolling (added `window.scrollY` to a `position:fixed` menu) — fixed.
- Categories admin hit `/api/admin/categories` (404) — route is `/api/categories`; privilege gate used invalid `'admin'` role.
- Curated Collections saved Title-Case values that failed the lowercase enum — now derived from `taxonomy.json`.
- NewsletterPage used non-existent Tailwind colour scales (`bronze-500` etc.) — see the flat-colour rule below.
- Product Create modal was missing the Price/Tax section that Edit had; both modals were ~80% duplicated — extracted a shared `product-form/` module.
- Banner/Collection/Settings mutation routes were unauthenticated — now require `moderate`/`super`.

## Conventions to respect

- **Tailwind brand colours are flat** (`bronze`, `champagne`, `gold`, …). Use opacity modifiers (`text-bronze/60`), **never numbered scales** (`bronze-500` is undefined → silently unstyled).
- **Money** always goes through `pricing.js` (client) / `pricingService.js` (server). Never hardcode a price, GST rate, or shipping fee in a component.
- **Taxonomy** (categories/subcategories/collections) comes from `frontend/src/utils/taxonomy.json` — shared by the backend product model. Collection values are **lowercase**.
- **Customer-facing URL** is `https://www.angelfashionstudio.org` (the `www` form).
- **Emails** are fire-and-forget; never `await` them in a request handler.

## Quick reference

| Thing | Value |
|---|---|
| Storefront | https://www.angelfashionstudio.org |
| Admin | https://admin.angelfashionstudio.org |
| API | https://prod-api.angelfashionstudio.org |
| Droplet IP | 209.38.89.133 |
| pm2 process | `angel-backend` (id 0), Node :5000 |
| DNS | OpenSRS (manage.opensrs.net), NS `*.systemdns.com` |
| Email | ZeptoMail (api.zeptomail.in) |
| Payments | eWAY Rapid RSP (`EWAY_ENDPOINT` Sandbox/Production) |
| DB | MongoDB Atlas |
