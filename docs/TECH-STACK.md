# Tech Stack Document
## Burhani Traders Website

**Version:** 1.0  
**Last Updated:** February 2026

---

## 1. Recommended Stack (Default)

A **static-first** approach keeps hosting simple and performance high; dynamic behavior can be added via client-side or serverless.

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend** | React (Vite) or Next.js (static export) | Component reuse, good DX, easy deployment. Next.js gives SSG + optional API routes. |
| **Styling** | Tailwind CSS | Fast UI build, responsive utilities, matches reference’s clean layout. |
| **Content / Data** | JSON or Markdown + import, or CMS later | Categories/products as JSON; About/Contact copy in JSON or MD. Optional: headless CMS (Strapi, Sanity) in Phase 2. |
| **Forms** | Formspree / Netlify Forms / or Next.js API route | No backend required for MVP; form submission via third-party or serverless. |
| **Hosting** | Vercel / Netlify / GitHub Pages | Free tier, HTTPS, optional serverless. |
| **Search** | Client-side (e.g. Fuse.js) or Algolia later | Simple: filter product list in browser; optional Algolia for scale. |

### 1.1 Alternative Stacks

- **Pure HTML/CSS/JS:** No build step; good if you want minimal tooling. Use a simple template and repeat header/footer.
- **Next.js (App Router) + MDX:** If you want content in repo and rich content; still static export.
- **Astro:** If you prefer minimal JS and “islands”; good for content-heavy catalog.

---

## 2. Project Structure (Example – Vite + React)

```
burhanitradersctg/
├── public/
│   ├── favicon.ico
│   ├── images/          # hero, logos, categories, products
│   └── ...
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── HeroCarousel.jsx
│   │   ├── WhatsAppFab.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── data/
│   │   ├── categories.json
│   │   ├── products.json
│   │   └── site.json      # company name, contact, social
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── docs/
│   ├── PRD.md
│   ├── DESIGN.md
│   ├── TECH-STACK.md
│   └── TODO.md
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

If using **Next.js**: use `app/` or `pages/` per Next version; keep `components/`, `data/`, and `docs/` conceptually the same.

---

## 3. Data Shape (Reference)

### 3.1 Site config (`site.json` or in code)

```json
{
  "name": "Burhani Traders",
  "tagline": "Your tagline here",
  "phone": "+88 XXX XXXXXXX",
  "email": "info@burhanitraders.com",
  "address": "Your address, Chittagong",
  "whatsapp": "88XXXXXXXXXX",
  "social": {
    "facebook": "",
    "instagram": "",
    "youtube": "",
    "linkedin": ""
  }
}
```

### 3.2 Categories (`categories.json`)

```json
[
  { "id": "power-tools", "name": "Power Tools", "slug": "power-tools", "productCount": 0, "image": "/images/categories/power-tools.jpg" },
  { "id": "measuring-tools", "name": "Measuring Tools", "slug": "measuring-tools", "productCount": 0, "image": "/images/categories/measuring-tools.jpg" }
]
```

### 3.3 Products (`products.json`)

```json
[
  {
    "id": "prod-1",
    "name": "Product Name",
    "slug": "product-name",
    "categoryId": "power-tools",
    "categoryName": "Power Tools",
    "brand": "Brand Name",
    "image": "/images/products/prod-1.jpg",
    "price": null,
    "showPrice": false,
    "featured": true,
    "new": false,
    "description": "Short or long description."
  }
]
```

Use `price: null` and `showPrice: false` to show “Inquire for price” instead of a number.

---

## 4. Routing

- **React (Vite):** `react-router-dom`: `/`, `/products`, `/products/category/:slug`, `/products/:slug`, `/about`, `/contact`. 404 catch-all.
- **Next.js:** `app/page.js`, `app/products/page.js`, `app/products/category/[slug]/page.js`, `app/products/[slug]/page.js`, `app/about/page.js`, `app/contact/page.js`, `app/not-found.js`.

---

## 5. Forms (Contact / Get a Quote)

- **Option A:** Formspree — form `action` points to Formspree endpoint; no backend.
- **Option B:** Netlify Forms — add `data-netlify="true"` and hidden form name; works on Netlify.
- **Option C:** Next.js API route — `POST /api/contact` sends email via Nodemailer or SendGrid (env vars for credentials).
- **Option D:** EmailJS (client-side) — no backend; configure in EmailJS dashboard.

Choose one; document in README and in PRD/Design if needed.

---

## 6. Performance & SEO

- **Images:** WebP with fallback; `width`/`height` or aspect-ratio to avoid CLS; lazy loading below fold.
- **Fonts:** System font stack or single webfont (e.g. Google Fonts) with `display=swap`.
- **Meta:** Per-page title and description (React Helmet or Next.js `metadata`).
- **Sitemap:** Generate `sitemap.xml` (script or plugin) for static site.
- **Analytics:** Optional Google Analytics or Plausible; add via script or component.

---

## 7. Environment & Deployment

- **Env:** Use `.env` for form endpoint, WhatsApp number, or API keys; never commit secrets.
- **Build:** `npm run build`; output is `dist/` (Vite) or `out/` (Next static export).
- **Deploy:** Connect repo to Vercel/Netlify; build command and output directory from framework.
- **Domain:** Configure custom domain in hosting dashboard; SSL is automatic on Vercel/Netlify.

---

## 8. Dependencies (Example – Vite + React)

**Core:**  
`react`, `react-dom`, `react-router-dom`, `vite`

**Styling:**  
`tailwindcss`, `postcss`, `autoprefixer`

**Optional:**  
`fuse.js` (search), `react-helmet-async` (meta), `lucide-react` or `react-icons` (icons)

---

## 9. References

- PRD: `docs/PRD.md`
- Design: `docs/DESIGN.md`
- Todo: `docs/TODO.md`
