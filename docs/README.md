# Angel Fashion Studio — Documentation

Complete, current knowledge base for the Angel Fashion Studio e-commerce platform. This folder supersedes the older scattered `.md` files in the repo root (which referenced Stripe, Koyeb, Chakra UI, and Zoho DNS — all now out of date).

## What this app is

A MERN e-commerce platform for **Angel Fashion Studio**, an Australian fashion store. A single React app serves both the **customer storefront** and the **admin panel**; a Node/Express API backs it with MongoDB Atlas.

- **Storefront:** https://www.angelfashionstudio.org
- **Admin panel:** https://admin.angelfashionstudio.org
- **API:** https://prod-api.angelfashionstudio.org
- **Currency:** AUD, GST-inclusive (10%)

## Documentation index

| Doc | What's inside |
|---|---|
| [architecture.md](architecture.md) | Tech stack, monorepo layout, request/data flow, data models, key modules |
| [domains-dns.md](domains-dns.md) | Domain map and every DNS record (managed at OpenSRS) |
| [deployment.md](deployment.md) | How to deploy & redeploy — frontend (Vercel), backend (DigitalOcean + pm2), database (Atlas) |
| [environment-variables.md](environment-variables.md) | Every env var (frontend + backend) with correct production values |
| [payments-and-pricing.md](payments-and-pricing.md) | eWay payment flow, the pricing model (GST/discount/coupons/shipping), server-authoritative pricing, inventory decrement |
| [email.md](email.md) | Email via ZeptoMail (why not SMTP), templates, setup, testing, troubleshooting |
| [operations-runbook.md](operations-runbook.md) | Day-to-day ops (logs, restart, deploy), and a catalogue of known issues + fixes |
| [eway-rapid-reference.md](eway-rapid-reference.md) | eWAY Rapid integration vendor reference (detailed) |

## Stack at a glance

| Layer | Tech |
|---|---|
| Frontend | React 17, React Router 5, **Tailwind CSS**, Firebase Auth (customers), GSAP/Framer Motion, Recharts |
| Backend | Node.js + Express 4, Mongoose 6, JWT (admin auth) |
| Database | MongoDB Atlas |
| Payments | **eWAY Rapid** — Responsive Shared Page (hosted) |
| Images | Cloudinary |
| Email | **ZeptoMail** (Zoho transactional email, HTTPS API) |
| Frontend host | Vercel |
| Backend host | DigitalOcean Droplet (Ubuntu) + pm2 |
| DNS | OpenSRS (`systemdns.com` nameservers) |

> ⚠️ The old root docs (`README.md`, `ultimate_deployment_guide.md`, `task.md`, `BACKEND.md`, `FRONTEND.md`, `FEATURES.md`) are **historical and inaccurate**. Treat this `docs/` folder as the single source of truth.
