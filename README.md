# Burhani Traders

A professional product catalog and company website for **Burhani Traders**, inspired by [aaliqadar.ae](https://aaliqadar.ae/).

## Stack

- **React 18** + **Vite**
- **Tailwind CSS**
- **React Router**
- **Lucide React** (icons)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Project structure

- `src/data/` – Site config, categories, products, brands (JSON). Edit these to change content.
- `src/components/` – Header, Footer, HeroCarousel, ProductCard, etc.
- `src/pages/` – Home, Products, Category, Product Detail, About, Contact, 404.
- `docs/` – PRD, Design, Tech stack, and Todo reference docs.

## Contact form

Submissions are sent with **Nodemailer** from a **Vercel serverless** route at `/api/contact` (see `api/contact.js`). SMTP credentials stay on the server only.

1. Use a free SMTP provider (e.g. [Brevo](https://www.brevo.com) — free tier, SMTP relay).
2. In **Vercel → Project → Settings → Environment Variables**, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_TO` (see `.env.example`). Redeploy.
3. Local email testing: install [Vercel CLI](https://vercel.com/docs/cli), put the same variables in `.env.local`, run `npm run dev:vercel`. Or set `VITE_CONTACT_API_ORIGIN` to your deployed URL while using `npm run dev`.

## Customization

- **Site info:** Edit `src/data/site.json` (name, tagline, phone, email, address, WhatsApp, social links, about copy).
- **Categories:** `src/data/categories.json`.
- **Products:** `src/data/products.json`.
- **Brands (homepage strip):** `src/data/brands.json`.

Add images under `public/images/` (e.g. `public/images/products/`, `public/images/categories/`) and set the paths in the JSON files.

## Docs

See `docs/` for:

- **PRD.md** – Requirements and scope  
- **DESIGN.md** – Layout and components  
- **TECH-STACK.md** – Stack and data shape  
- **TODO.md** – Implementation checklist  
