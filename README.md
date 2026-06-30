# Angel Fashion Studio — E-commerce Platform

A MERN e-commerce platform for **Angel Fashion Studio** (Australian fashion). A single React app serves both the **customer storefront** and the **admin panel**; a Node/Express API backs it with MongoDB Atlas. Currency is AUD, GST-inclusive.

- **Storefront:** https://www.angelfashionstudio.org
- **Admin panel:** https://admin.angelfashionstudio.org
- **API:** https://prod-api.angelfashionstudio.org

## 📚 Documentation

All current, accurate documentation lives in **[`docs/`](docs/README.md)** — start there.

| Doc | What's inside |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Stack, monorepo layout, data flow, models |
| [docs/domains-dns.md](docs/domains-dns.md) | Domains + DNS records (OpenSRS) |
| [docs/deployment.md](docs/deployment.md) | Deploy/redeploy (Vercel, DigitalOcean + pm2, Atlas) |
| [docs/environment-variables.md](docs/environment-variables.md) | All env vars with correct values |
| [docs/payments-and-pricing.md](docs/payments-and-pricing.md) | eWAY flow, pricing/GST/discounts/shipping, inventory |
| [docs/email.md](docs/email.md) | Email via ZeptoMail (and why not SMTP) |
| [docs/operations-runbook.md](docs/operations-runbook.md) | Ops + known issues & fixes |

## Run locally

```bash
# Backend → http://localhost:5000
cd backend && npm install && npm start

# Frontend → http://localhost:3000  (admin at /admin)
cd frontend && npm install && npm start
```
Both need their own `.env` — see [docs/environment-variables.md](docs/environment-variables.md).

## Stack

React 17 + Tailwind CSS · Firebase Auth (customers) · Node/Express + Mongoose · MongoDB Atlas · eWAY Rapid (payments) · Cloudinary (images) · ZeptoMail (email). Frontend on **Vercel**, backend on a **DigitalOcean droplet** (pm2), DNS at **OpenSRS**.
