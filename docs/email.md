# Email

## TL;DR

Transactional email is sent via **ZeptoMail** (Zoho's transactional service) over its **HTTPS API** — **not SMTP**. This is because **DigitalOcean blocks all outbound SMTP** (ports 25/465/587) on the droplet, and they refused to lift it. The HTTPS API (port 443) sidesteps the block entirely.

- Transport code: `backend/utils/emailService.js` (function `sendEmail`)
- API endpoint: `https://api.zeptomail.in/v1.1/email` (India DC, matches the Zoho/MX region)
- From address: `support@angelfashionstudio.org` (`ZOHO_EMAIL_USER`), on the ZeptoMail-verified domain
- Auth: header `Authorization: Zoho-enczapikey <ZEPTOMAIL_TOKEN>` (the code adds the prefix; store only the key)

## The emails (all transactional)

| Email | Trigger | Code |
|---|---|---|
| Order confirmation (+ tax-invoice PDF) | Successful payment | `orderService` → `sendOrderConfirmation` |
| Order status update | Admin marks shipped/delivered/cancelled | `orderController` → `sendStatusUpdate` |
| Welcome | Customer profile first created (Firebase sign-up) | `userController` → `sendWelcomeEmail` |
| Return status | Admin approves/rejects/completes a return | `orderController` → `sendReturnUpdate` |
| Back-in-stock | Restock of a watched product | `restockController` |

All senders are **fire-and-forget** (not awaited) so a slow/failing email never blocks or breaks an API response. `sendEmail` catches its own errors and returns `null` — it never throws.

## Why not SMTP? (the saga, so nobody repeats it)

1. SMTP via Zoho (`smtppro.zoho.in:465`) timed out on the droplet → "Connection timeout" on every email.
2. Tests proved **DigitalOcean blocks 465 AND 587 to every provider** (Zoho *and* Gmail), while general HTTPS (443) works. Not a firewall, not Zoho — DO's account-level SMTP block.
3. DigitalOcean **support ticket was denied** ("we are unable to facilitate requests to remove the restriction on this port") and explicitly recommended **port 2525 or an HTTP API**.
4. → Switched to ZeptoMail's HTTPS API. Done.

Note: the Zoho account is in the **India datacenter**, so SMTP host (if ever used) is `smtppro.zoho.in` — the global `.com` host returns `535 Authentication Failed`. ZeptoMail is likewise `.in`.

## ZeptoMail setup (one-time)

1. **Sign up** at zeptomail.com with the Zoho account that owns the domain.
2. **Verify the domain** `angelfashionstudio.org` — add the DNS records in **OpenSRS** (see [domains-dns.md](domains-dns.md)):
   - TXT `26104357._domainkey` → `k=rsa; p=…` (DKIM)
   - CNAME `bounce-zem` → `cluster89.zeptomail.in` (return-path; handles SPF alignment, so **don't change the main SPF**)
3. **Create a Mail Agent** → copy the **Send Mail token** (only the part after `Zoho-enczapikey `).
4. Set `ZEPTOMAIL_TOKEN=<key>` in the backend `.env`, deploy, `pm2 restart --update-env`.

### Billing
- **Prepaid credits**, not a subscription. ~**$2.50 per 10,000 emails**, credits valid ~6 months. Auto-top-up is off by default (no surprise charges).
- A **free trial credit** (10,000 emails) covers initial use.
- **Account review** (up to ~2 working days) is required before you can *buy* more credits — the trial credit works during review.
- Buy one small pack before real volume so you don't hit the trial cap mid-orders.

## Testing

Connectivity is over HTTPS, so it works from anywhere (including the blocked droplet). From `backend/`:
```bash
node -e "require('dotenv').config(); require('./utils/emailService').sendEmail({email: process.env.ZOHO_EMAIL_USER, subject:'ZeptoMail test', html:'<p>ok</p>'}).then(r=>console.log(r?'SENT':'FAILED'))"
pm2 logs angel-backend --lines 5 | grep -i EMAIL   # look for [EMAIL SENT] … RequestId
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Connection timeout` on SMTP | DO blocks SMTP ports | Use ZeptoMail HTTPS API (already in place) |
| `535 Authentication Failed` (SMTP) | Wrong Zoho datacenter host | Use `smtppro.zoho.in` (India), not `.com` |
| ZeptoMail send returns null / 401 | Token has the `Zoho-enczapikey ` prefix, or wrong key | Store **only the key** in `ZEPTOMAIL_TOKEN` |
| Send works to own domain, fails to external | Trial cap / account under review | Wait for review, add a credit |
| Email lands in spam | New sending domain reputation | DKIM is set; improves as volume builds |
| Welcome/restock link goes to localhost | Old `FRONTEND_URL` | Now uses `FRONTEND_PUBLIC_URL`; set it + deploy |
