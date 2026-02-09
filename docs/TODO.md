# Todo List – Burhani Traders Website
## Reference checklist for implementation

Use this list as a single reference while building. Tick off items as you complete them. Order is suggested but can be adjusted (e.g. design system first, then pages).

---

## Phase 0: Setup

- [ ] Initialize project (Vite + React or Next.js per TECH-STACK.md)
- [ ] Configure Tailwind CSS and base styles
- [ ] Add `docs/` to repo (PRD, DESIGN, TECH-STACK, TODO)
- [ ] Create `public/images` and placeholder assets
- [ ] Create `src/data/site.json`, `categories.json`, `products.json` with sample data
- [ ] Set up routing (React Router or Next.js pages)

---

## Phase 1: Global & Layout

- [ ] **Header:** Top bar (phone, email, Inquire/Get a Quote)
- [ ] **Header:** Logo + company name + tagline (link to home)
- [ ] **Header:** Main nav (Home, Products, About, Contact)
- [ ] **Header:** Search (UI + wire to client-side search or placeholder)
- [ ] **Header:** “Get a Quote” button
- [ ] **Header:** Mobile hamburger + drawer with nav and categories
- [ ] **Footer:** Quick links (Home, Products, About, Contact, Privacy, Terms)
- [ ] **Footer:** Product categories column
- [ ] **Footer:** Contact (address, phone, email)
- [ ] **Footer:** Social links
- [ ] **Footer:** Copyright + optional “Designed by” line
- [ ] **WhatsApp FAB:** Fixed bottom-right, link to `wa.me/<number>`
- [ ] **Scroll to top** button (optional)
- [ ] **Skip links:** “Skip to navigation”, “Skip to main content”

---

## Phase 2: Homepage

- [ ] Hero carousel (2–3 slides, arrows, dots, optional auto-play)
- [ ] Brand logos strip below hero
- [ ] Product categories section (heading + grid of category cards)
- [ ] Featured products section (tabs: New / Featured / Top Sellers)
- [ ] Product cards: image, category, brand, title, price or “Inquire for price”, “Product Details”
- [ ] Stats strip (Brands, Categories, Clients, Years)
- [ ] “Must-have” section with category links + sample products
- [ ] “Engineered for real work” highlight + similar products row
- [ ] CTA banner (“Get a Quote” + supporting text)
- [ ] Ensure all content uses Burhani Traders branding (no Aaliqadar)

---

## Phase 3: Products & Categories

- [ ] Products listing page (all products or category index)
- [ ] Category page: breadcrumb, title, product count, product grid
- [ ] Product detail page: image, title, category, brand, price/CTA, description, CTA
- [ ] Wire “Product Details” and category links to correct routes
- [ ] (Optional) Client-side search on products/category page

---

## Phase 4: About & Contact

- [ ] About page: title, intro paragraphs
- [ ] About: “Why Us?” list
- [ ] About: “Our Vision” section
- [ ] About: “Our Clients” carousel or grid (optional, if content exists)
- [ ] Contact page: “Contact Details” (address, email, phone) with icons
- [ ] Contact page: Form (Name, Email, Message) + Submit
- [ ] Form submission: Formspree / Netlify Forms / API route / EmailJS
- [ ] Success/error message after submit

---

## Phase 5: Polish & Launch

- [ ] 404 page (message, search, “Get a Quote” / “Go Home”)
- [ ] Meta titles and descriptions per page
- [ ] Favicon and optional OG image
- [ ] Image optimization (WebP, dimensions, lazy load)
- [ ] Accessibility pass (focus, alt, labels, skip links)
- [ ] Test on mobile and desktop
- [ ] Replace placeholder content with real Burhani Traders copy and assets
- [ ] Configure deployment (Vercel/Netlify) and custom domain (if any)
- [ ] Add analytics (optional)

---

## Content Checklist (for you / stakeholder)

- [ ] Final company name and tagline
- [ ] Logo (SVG/PNG)
- [ ] Address, phone, email, WhatsApp number
- [ ] Social profile URLs
- [ ] About copy (intro, Why Us, Vision)
- [ ] Category list and optional category images
- [ ] Product list (name, category, brand, image, price or “Inquire”)
- [ ] Hero images (3)
- [ ] Brand/partner logos (if any)
- [ ] Privacy Policy & Terms (pages or links)

---

## References

- **PRD:** `docs/PRD.md` – scope, user stories, requirements
- **Design:** `docs/DESIGN.md` – layout, components, responsive, a11y
- **Tech stack:** `docs/TECH-STACK.md` – stack, data shape, deployment
