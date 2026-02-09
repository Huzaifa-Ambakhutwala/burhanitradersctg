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

Without configuration, the contact form runs in **demo mode** (shows success without sending). To send submissions to your inbox:

1. Create a form at [Formspree](https://formspree.io) and copy your form ID.
2. Create a `.env` file in the project root and add: `VITE_FORMSPREE_ID=your_form_id`
3. Restart the dev server.

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
