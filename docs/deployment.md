# Deployment

The app is a monorepo deployed across three places:

| Part | Where | How |
|---|---|---|
| Frontend (`frontend/`) | **Vercel** | Auto-build from GitHub on push |
| Backend (`backend/`) | **DigitalOcean Droplet** (Ubuntu, IP `209.38.89.133`) | `pm2` process `angel-backend` |
| Database | **MongoDB Atlas** | Managed |

## Frontend — Vercel

- **Root Directory:** `frontend`
- **Framework preset:** Create React App
- **Build:** `npm run build` → static output on Vercel's edge.
- **Domains:** `www.angelfashionstudio.org` and `admin.angelfashionstudio.org` both point to this one project (see [domains-dns.md](domains-dns.md)).
- **Env vars** (Vercel → Project → Settings → Environment Variables — these are **build-time**, so a change requires a **redeploy/rebuild**):
  - `REACT_APP_BACKEND_HOST=https://prod-api.angelfashionstudio.org` ← must be **https** (http causes a Mixed-Content warning), **no trailing slash**
  - Firebase config keys (`REACT_APP_FIREBASE_*`)
  - See [environment-variables.md](environment-variables.md).

**Deploy:** push to the connected branch → Vercel rebuilds automatically. To force a rebuild after an env change, trigger a redeploy in the Vercel dashboard.

## Backend — DigitalOcean droplet + pm2

The Node API runs on the droplet under **pm2** (process name `angel-backend`, id `0`), listening on **port 5000**. HTTPS for `prod-api.angelfashionstudio.org` is terminated by a reverse proxy in front of Node (confirm the exact proxy — typically nginx/Caddy with a Let's Encrypt cert — on the server).

### First-time / standard deploy
```bash
ssh root@209.38.89.133
cd /path/to/angel/backend        # the repo's backend folder on the droplet
git pull                          # get the latest code
npm install                       # if dependencies changed
pm2 restart angel-backend --update-env   # reload code + env
pm2 logs angel-backend --lines 30        # confirm clean startup
```

### After changing `.env`
You **must** use `--update-env`, or pm2 keeps the old environment:
```bash
pm2 restart angel-backend --update-env
```

### Useful pm2 commands
```bash
pm2 list                              # status, uptime, restart count
pm2 logs angel-backend                # live tail
pm2 logs angel-backend --err --lines 100   # errors only
pm2 logs angel-backend --lines 1000 --nostream | grep -i EMAIL   # filter
pm2 describe 0                        # details + log file paths
pm2 restart angel-backend             # restart (keeps env)
```
Log files live at `~/.pm2/logs/angel-backend-out.log` and `…-error.log`.

> ⚠️ **Deploying `.env` changes alone does nothing if the code isn't deployed too.** Many fixes live in the code (pricing, email transport, redirect targets). Always `git pull` the backend AND `pm2 restart --update-env`.

## Database — MongoDB Atlas
- Connection string in `MONGODB_URI` (`mongodb+srv://…`).
- The droplet's IP must be on the Atlas **IP Access List**.

## Go-live checklist (test → production)

1. **eWAY:** set `EWAY_ENDPOINT=Production` (currently `Sandbox` = test cards only) and use live API key/password.
2. **Frontend:** `REACT_APP_BACKEND_HOST=https://prod-api.angelfashionstudio.org` (https), rebuild on Vercel.
3. **Backend `.env`:** `FRONTEND_PUBLIC_URL=https://www.angelfashionstudio.org`, `ALLOWED_ORIGINS` includes the real storefront + admin domains, `ZEPTOMAIL_TOKEN` set.
4. **Email:** ZeptoMail account approved + a credit purchased (see [email.md](email.md)).
5. **Firebase:** add `angelfashionstudio.org` and `www.angelfashionstudio.org` to Authorized Domains (Firebase Console → Authentication → Settings).
6. Place one real test order end-to-end and confirm: order in admin, stock decremented on the correct variant, confirmation email + invoice received, redirect lands on `/orders?success=true` (not localhost).
