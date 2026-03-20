# 🚀 Deployment Guide — Experiment 7.1 (MERN Products)

## Architecture
```
GitHub Repo
└── EXP7/
    └── exp7.1/
        └── mern-products/
            ├── server/   → Deploy on Render.com
            └── client/   → Deploy on Vercel
```

---

## Step 1 — Push to GitHub

```bash
# From your repo root
git add EXP7/
git commit -m "Add EXP7.1 MERN Products App"
git push origin main
```

---

## Step 2 — Deploy Backend on Render.com

1. Go to https://render.com → Sign in with GitHub
2. Click **New** → **Web Service**
3. Connect your repo: `Full-stack-Development`
4. Set these fields:
   - **Name:** `mern-products-api`
   - **Root Directory:** `EXP7/exp7.1/mern-products/server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Under **Environment Variables**, add:
   - `MONGO_URI` = `mongodb+srv://dbuser:dbpass123@cluster0.sn8whdg.mongodb.net/products_db`
6. Click **Create Web Service**
7. Wait ~2 min → You get a URL like: `https://mern-products-api.onrender.com`

---

## Step 3 — Deploy Frontend on Vercel

1. Go to https://vercel.com → Sign in with GitHub
2. Click **Add New Project** → Import `Full-stack-Development`
3. Set these fields:
   - **Root Directory:** `EXP7/exp7.1/mern-products/client`
   - **Framework:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Under **Environment Variables**, add:
   - `REACT_APP_API_URL` = `https://mern-products-api.onrender.com/api`
     *(replace with your actual Render URL from Step 2)*
5. Click **Deploy**
6. You get a live URL like: `https://mern-products.vercel.app`

---

## Step 4 — Seed the live database (optional)

If you want sample products in the deployed app:
```bash
cd EXP7/exp7.1/mern-products/server
node seed.js
```

---

## ✅ Final URLs (example)
| Service | URL |
|---------|-----|
| Frontend | https://mern-products-exp71.vercel.app |
| Backend API | https://mern-products-api.onrender.com/api/products |
| Health Check | https://mern-products-api.onrender.com/api/health |
