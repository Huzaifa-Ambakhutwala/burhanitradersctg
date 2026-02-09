# Design Document
## Burhani Traders Website

**Version:** 1.0  
**Reference:** [aaliqadar.ae](https://aaliqadar.ae/)  
**Last Updated:** February 2026

---

## 1. Design Direction

Clone the **layout, structure, and UX patterns** of aaliqadar.ae, applied to **Burhani Traders** branding. Visual identity (colors, logo, imagery) will be Burhani Traders–specific.

---

## 2. Layout & Page Structure

### 2.1 Global Layout

- **Top bar (above header):** Contact strip — phone, email, “INQUIRE NOW” (or “Get a Quote”) link. Optional: compact on mobile (icon + dropdown or single CTA).
- **Header:**
  - Left: Hamburger “Menu” (mobile); optional desktop nav or logo-first.
  - Center: Logo + company name + tagline.
  - Right: Search (icon + input or expandable), “Get a Quote” button.
- **Main content:** Full-width sections; max-width container for text/content where appropriate.
- **Footer:** Multi-column — Quick links, Product categories, Contact, Social, Copyright. Optional: newsletter or share CTA.
- **Floating:** WhatsApp FAB (bottom-right), “Scroll to top” (bottom-right, above or beside WhatsApp when scrolled).

### 2.2 Homepage Sections (Top to Bottom)

| Order | Section | Description |
|-------|---------|-------------|
| 1 | Hero carousel | Full-width image carousel; 2–3 slides. Each: background image, optional overlay, headline, short line, “Shop Now” CTA. Arrows + dot indicators. |
| 2 | Brand strip | Horizontal row of partner/brand logos (grayscale or color). Slight padding; optional “Trusted brands” label. |
| 3 | Product categories | Heading “Product Categories”. Grid of category cards (image or icon + title + product count). Links to category pages. |
| 4 | Featured products | Tabs or labels: “New”, “FEATURED”, “TOP SELLERS”. Product cards in a horizontal scroll or grid. Each card: image, category, brand, title, price or “Login/Inquire to see price”, “Product Details” link. |
| 5 | Stats strip | 4 columns: e.g. “20+ Brands”, “30+ Categories”, “1000+ Happy Clients”, “20+ Years”. Bold number + label; subtle background. |
| 6 | Must-have products | Heading “Must-have Products” / “Everything you need in one place”. List of category links + one highlighted product row (e.g. Automotive) with 3 product cards. |
| 7 | Highlight + similar | “Engineered for Real Work” — one featured product (large image, title, short description, CTA). Below: “Similar Products” — 3 related product cards. |
| 8 | CTA banner | Dark teal/green block. Headline e.g. “Powering Workshops, Contractors & Industries”, subline, “Get a Quote” button. |
| 9 | Footer | As in 2.1. |

### 2.3 Products / Category Pages

- **Products listing:** Optional sidebar filters (category, brand) in later phase; for now: heading, product grid (same card as homepage).
- **Category page:** Breadcrumb, category title, product count, grid of product cards.
- **Product detail (if implemented):** Hero image, title, category, brand, price or “Inquire for price”, description, “Inquire” / “Get a Quote” CTA; optional “Similar products” row.

### 2.4 About Page

- Page title: “About Burhani Traders”.
- Intro: 1–2 paragraphs (company, market, legacy).
- “Why Us?”: 4–5 bullet items (e.g. experience, delivery, local/imported, partnerships, values).
- “Our Vision”: 1–2 paragraphs.
- Optional: “Our Clients” — logo carousel or grid.

### 2.5 Contact Page

- **Left (or top on mobile):** “Contact Details” — Office Address, Email, Contact Number with icons.
- **Right (or below):** “Find the Right Tools” (or similar) heading, short copy, form: Name (required), Email (required), Comment/Message (optional), Submit.
- Optional: map embed; keep layout simple first.

### 2.6 404 Page

- Large “404” + “Not Found” text.
- Short message + search box + “Get a Quote” or “Go Home” CTA.
- Reuse header and footer.

---

## 3. Components

### 3.1 Header

- **Top bar:** Background distinct from main header (e.g. dark or accent); text and link contrast.
- **Logo:** Image (or text) + “BURHANI TRADERS” (or chosen name) + tagline. Click → Home.
- **Nav:** Home, Products, About us, Contact Us. Optional: Products dropdown by category.
- **Search:** Icon toggles input or opens search overlay; placeholder “Search for products”.
- **Get a Quote:** Button (primary style) → Contact or inquiry URL.
- **Mobile:** Hamburger opens drawer with nav + categories + search.

### 3.2 Product Card

- Image (aspect ratio fixed, e.g. 1:1), optional “New”/“Featured” badge.
- Category (small text, link).
- Product title (link to detail).
- Brand name.
- Price or “Login to see prices” / “Inquire for price”.
- “Product Details” link/button.

### 3.3 Category Card

- Image or icon.
- Category name (heading).
- Product count.
- Link to category page.

### 3.4 Buttons

- **Primary:** Solid (e.g. green/teal), “Get a Quote”, “Shop Now”, “Submit”.
- **Secondary:** Outline or text for “Product Details”, “Read more”.
- **WhatsApp FAB:** Green circle, WhatsApp icon, fixed bottom-right; link to `https://wa.me/<number>`.

### 3.5 Forms

- **Contact form:** Label + input; required indicators; Submit button; success/error message area.
- **Search:** Single input + search button or icon; clear on submit.

### 3.6 Carousels

- Hero: Previous/Next arrows, dot indicators, auto-advance optional; pause on hover/focus.
- Brands: Horizontal scroll or fade; no arrows on small screens if scroll is natural.
- “Our Clients”: Same pattern as brands.

---

## 4. Visual Style (Reference-Based)

- **Colors (from reference):** Primary green/teal for CTAs and accents; blue for headings/links; white/light gray backgrounds; dark text for body. **Burhani Traders:** Replace with brand palette (primary, secondary, neutrals).
- **Typography:** Sans-serif for UI and body; clear hierarchy (H1–H4, body, small). Decide: one font family or heading + body pair.
- **Imagery:** Product photos (consistent ratio); hero images (tools/workshop/construction); avoid stock that still shows competitor branding.
- **Spacing:** Consistent vertical rhythm between sections; comfortable padding in cards and forms.
- **Borders & shadows:** Light borders or subtle shadows for cards; minimal for a clean look.

---

## 5. Responsive Breakpoints

- **Mobile:** &lt; 768px — single column, hamburger menu, stacked forms, carousel single slide or swipe.
- **Tablet:** 768px–1024px — 2-column grids where appropriate, optional condensed header.
- **Desktop:** &gt; 1024px — full layout (e.g. 3–4 column product grid, full nav, top bar visible).

---

## 6. Accessibility

- Semantic HTML (header, main, nav, footer, sections, headings).
- Skip links: “Skip to navigation”, “Skip to main content”.
- Focus visible on all interactive elements; no keyboard traps.
- Alt text for all meaningful images; decorative images empty alt or role.
- Form labels associated; errors announced.
- Carousel: pause control, labelled arrows/dots, optional reduced motion.

---

## 7. Assets to Prepare

- Logo (SVG or PNG, light/dark if needed).
- Favicon.
- Hero images (3 for carousel).
- Brand logos (partners/suppliers).
- Category images or icons (or placeholders).
- Product images (or placeholders).
- Social icons (Facebook, Instagram, YouTube, LinkedIn) or use icon set.

---

## 8. References

- PRD: `docs/PRD.md`
- Tech stack: `docs/TECH-STACK.md`
- Todo: `docs/TODO.md`
