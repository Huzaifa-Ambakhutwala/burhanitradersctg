# Firebase setup (Burhani Traders)

The app uses **Firebase Authentication (Google)**, **Cloud Firestore**, and **Firebase Storage**. The old Node backend is no longer used by the frontend.

## 1. Console checklist

In [Firebase Console](https://console.firebase.google.com/) for project `burhanitraders`:

1. **Authentication** → Sign-in method → enable **Google** and set a support email.
2. **Authentication** → **Settings** → **Authorized domains** → add:
   - `localhost`
   - `burhanitradersctg.vercel.app` (and any preview domains you use)
3. **Firestore** → Create database (production mode is fine).
4. **Storage** → Get started (default bucket).

## 2. Security rules

Deploy the rules in this repo (or paste them in the Console):

- Firestore: `firebase/firestore.rules`
- Storage: `firebase/storage.rules`

With [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
npm install -g firebase-tools
firebase login
firebase init   # link project, choose Firestore + Storage if prompted
firebase deploy --only firestore:rules,storage
```

Ensure `firebase.json` at the repo root points at those rule files (already configured).

## 3. Environment variables (Vite)

Copy `.env.example` to `.env.local` for local dev. For **Vercel**, add the same `VITE_*` variables under Project → Settings → Environment Variables, then redeploy.

| Variable | Source |
|----------|--------|
| `VITE_FIREBASE_API_KEY` | Project settings → Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | same |
| `VITE_FIREBASE_PROJECT_ID` | same |
| `VITE_FIREBASE_STORAGE_BUCKET` | same |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | same |
| `VITE_FIREBASE_APP_ID` | same |
| `VITE_FIREBASE_MEASUREMENT_ID` | same (optional) |

## 4. First-time data

1. Sign in at `/admin/login` with Google — the **first** account becomes **admin** (atomic `settings/bootstrap` + your `users/{uid}` doc).
2. In **Admin → Products**, click **Import catalog from JSON** once to copy all products from the bundled `products.json` into Firestore.
3. Upload product images under each product; files go to Storage and `primaryImageUrl` is updated on the product doc.

## 5. Users

- New Google users after the first get role **pending** and see `/admin/pending`.
- An **admin** opens **Admin → Users** (`/admin/users`) to see all accounts and set pending users to **approved** so they can use the admin product/photo tools.

## 6. Security note

If an API key was ever posted in a public place, rotate it in Google Cloud Console (API credentials) and update env vars everywhere.
