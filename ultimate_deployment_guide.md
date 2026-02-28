# 🚀 Ultimate Deployment & Launch Guide: Angel Fashion Studio

This document explains **exactly** how we will deploy the application from your single GitHub repository, connect your custom domains (`angelfashionstudio.org` and `admin.angelfashionstudio.org`), and configure Stripe Webhooks for Test Mode.

---

## 🏗️ 1. Architecture Overview (The Monorepo)

Your GitHub repository (`angel`) contains both your React UI (`/frontend`) and your Node.js API (`/backend`). This is called a **Monorepo**. 

Here is how the platforms handle it:
1.  **Frontend -> Vercel:** Vercel will connect to your GitHub, look *only* inside the `frontend` folder, build your React site, and host it on their global Edge Network.
2.  **Backend -> Koyeb:** Koyeb will connect to your GitHub, look *only* inside the `backend` folder, install your Node.js dependencies, and run your server on a continuous cloud machine.
3.  **Database -> MongoDB Atlas:** Koyeb talks to MongoDB Atlas to save order and product data.

---

## 📝 2. Step-by-Step Execution Plan

Follow these exact steps in order.

### Step 1: Deploy Backend to Koyeb
We deploy the backend first because the frontend needs to know its URL.

1. **Log into Koyeb (koyeb.com)** and click **Create Web Service**.
2. Select **GitHub** and authorize it to access your `angel` repository.
3. **Configure the Service:**
   * In the **Builder** or **Build settings** section, look for **Work Directory** (or Base Directory). Type exactly: `backend`
   * Ensure the **Run Command** is empty (it will automatically read `npm start` from your backend `package.json`).
4. **Environment Variables:** Add all of these from your local `.env` file (Make sure there are NO spaces around the `=` signs):
   * `PORT=5000`
   * `MONGO_URI=` (Your MongoDB Atlas connection string)
   * `JWT_SECRET=` (Your secret string, e.g., 'supersecretkey123')
   * `STRIPE_SECRET_KEY=` (Your test mode `sk_test_...` key)
   * `STRIPE_WEBHOOK_SECRET=` (Leave blank for now, we will add it in Step 3!)
   * `CLOUDINARY_CLOUD_NAME=`, `CLOUDINARY_API_KEY=`, `CLOUDINARY_API_SECRET=`
   * `ZOHO_EMAIL_USER=`, `ZOHO_EMAIL_PASS=`
   * `ALLOWED_ORIGINS=https://www.angelfashionstudio.org,https://angelfashionstudio.org,https://admin.angelfashionstudio.org`
5. Click **Deploy**. 
6. Wait 3-5 minutes. Once it is running, Koyeb will give you a public URL (e.g., `https://angel-backend.koyeb.app`). **Copy this URL.**

---

### Step 2: Deploy Frontend to Vercel

1. **Log into Vercel (vercel.com)** and click **Add New Project**.
2. Import your `angel` GitHub repository.
3. **Configure the Project:**
   * **Root Directory:** Click Edit, select the `frontend` folder, and save.
   * **Framework Preset:** Vercel should auto-detect "Create React App".
4. **Environment Variables:** Open the **Environment Variables** dropdown and add:
   * **Key:** `REACT_APP_STRIPE_PUBLISHABLE_KEY` | **Value:** *Your test `pk_test_...` key*
   * **Key:** `REACT_APP_BACKEND_HOST` | **Value:** *The Koyeb URL you copied in Step 1 (e.g., `https://angel-backend.koyeb.app` - **NO trailing slash `/` at the end!**)*
5. Click **Deploy**. Vercel will build the React app.

---

### Step 3: Configure Stripe Test Mode Webhooks

Your backend will not clear the shopping cart or create an order until Stripe successfully tells it: *"The payment worked."* This communication happens via Webhooks.

1. **Log into Stripe Dashboard** and ensure the **"Test Mode"** toggle in the top right is turned ON.
2. Go to **Developers > Webhooks**.
3. Click **Add an endpoint**.
4. **Endpoint URL:** Paste your Koyeb URL, followed by the webhook route exactly like this:
   `https://angel-backend.koyeb.app/api/payment/webhook`
5. **Listen to events:** Click "Select events", search for **`checkout.session.completed`**, select it, and click Add events.
6. Click **Add endpoint**.
7. Under the "Signing secret" section on the webhook's page, click **Reveal**. It will look like `whsec_...`
8. **Copy that secret.**
9. **Go back to Koyeb Dashboard**, go to your service settings, and update your Environment Variables. Set `STRIPE_WEBHOOK_SECRET` to the `whsec_...` value you just copied. 
10. **Redeploy / Restart Koyeb** so it picks up the new secret.

*Test Mode is now fully secure and functional! It will behave exactly like Live Mode, but using mock credit cards.*

---

### Step 4: Connect Custom Domains (Zoho & Vercel)

Now we map your professional domain names to Vercel.

1. In the **Vercel Dashboard**, go to your project and click **Settings > Domains**.
2. Add **two** domains:
   * `angelfashionstudio.org` (Vercel may ask if you want to redirect `www` to it—say yes).
   * `admin.angelfashionstudio.org`
3. Vercel will give you an error saying "Invalid Configuration." This is normal! It will display **DNS Records** you need to add to Zoho.
   * Usually an **A Record** (IP Address `76.76.21.21`) for the root domain.
   * Usually a **CNAME Record** (pointing to `cname.vercel-dns.com`) for the `admin` subdomain.
4. **Log into Zoho Domains**, navigate to your DNS Settings, and paste those exact records.
5. Within 5 to 30 minutes, the Vercel dashboard will show a green checkmark next to your domains. 
6. **Typing `angelfashionstudio.org` will load your store, and `admin.angelfashionstudio.org` will load the secure admin dashboard!**

---

### 🚀 Launch Complete!
When you are ready to start selling for real money in the future, all you have to do is:
1. Turn off "Test Mode" in Stripe.
2. Replace the `pk_test` and `sk_test` keys with `live` keys in Koyeb and Vercel.
3. Create a new Live Webhook in Stripe pointing to the same Koyeb URL, and update Koyeb with the new live `whsec_...` secret!
