# Deploying Burhani Traders

Your **frontend** is on Vercel: https://burhanitradersctg.vercel.app  

**Admin login, product catalog, and photos** are backed by **Firebase** (Google Sign-In, Firestore, Storage). There is no production dependency on `VITE_BACKEND_URL` or the old Node server for the live site.

## Current setup (Firebase + Vercel)

1. In the Firebase Console, enable **Google** sign-in, **Firestore**, and **Storage**, and add your Vercel domains under **Authentication → Authorized domains**.
2. Deploy Firestore and Storage **security rules** from this repo (see [FIREBASE.md](./FIREBASE.md)).
3. In **Vercel → Settings → Environment Variables**, set every `VITE_FIREBASE_*` variable from your Firebase web app config (same names as in `.env.example`). Redeploy the frontend after saving.
4. **Contact form:** set server-only SMTP variables for `/api/contact` (Nodemailer): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` (see root `.env.example`). These are **not** `VITE_*` — they stay on Vercel only.
5. First Google sign-in on `/admin/login` becomes **admin**; use **Admin → Products → Import catalog** once, then upload images per product.

Full checklist: **[docs/FIREBASE.md](./FIREBASE.md)**.

---

## Legacy: Node + SQLite backend (optional)

The `backend/` folder is an older Express + SQLite stack. It is **not** required for the Firebase-based admin or storefront. You would only deploy it if you still want that API for something else; the sections below describe that path for reference.

### Why photos “disappeared” (historical)

- Vercel only hosts the static/React build.
- If the app pointed at `VITE_BACKEND_URL` and no backend was reachable, admin and photo APIs failed.

### If you still deploy the Node backend

Use a host with **persistent disk** (e.g. Fly.io with a volume) for SQLite and `uploads/`. Set `VITE_BACKEND_URL` on Vercel only if the frontend is wired to that API (the current Firebase build does not use it).

See previous Fly.io / Oracle / Render notes in git history if you need the long-form backend deploy steps.
