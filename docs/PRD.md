# Product Requirements Document (PRD)
## Burhani Traders Website

**Version:** 1.0  
**Reference:** Clone of [aaliqadar.ae](https://aaliqadar.ae/)  
**Business:** Burhani Traders  
**Last Updated:** February 2026

---

## 1. Overview

### 1.1 Purpose
Build a professional B2B/B2C product catalog and company website for **Burhani Traders**, inspired by the structure and UX of Aaliqadar Building Material Trading (aaliqadar.ae). The site will showcase products, brands, categories, and company information with clear CTAs for inquiries and contact.

### 1.2 Goals
- Present Burhani Traders as a credible supplier (tools / building materials / hardware as per business focus).
- Enable visitors to browse products by category and brand.
- Capture leads via contact form, “Get a Quote,” and WhatsApp.
- Provide About and Contact pages for trust and discovery.
- Be responsive and fast on mobile and desktop.

### 1.3 Target Users
- B2B: Contractors, workshops, retailers, construction companies.
- B2C: DIYers and professionals looking for tools/hardware.
- Geographic focus: Adjust for Burhani Traders’ market (e.g. Chittagong / Bangladesh or as specified).

---

## 2. Scope

### 2.1 In Scope
- **Homepage:** Hero carousel, brand strip, product categories grid, featured products, stats strip, “Must-have” products, “Engineered for real work” highlight, similar products, CTA banner, footer.
- **Products / Catalog:** Category listing, category pages, product cards (image, title, category, brand, price or “Login/Inquire for price”), product detail (optional in Phase 1).
- **About Us:** Company intro, “Why Us,” vision, optional “Our Clients” carousel.
- **Contact Us:** Contact details (address, email, phone), contact/enquiry form (Name, Email, Message), optional map.
- **Global:** Header (logo, nav, search, top contact strip), footer (links, categories, contact, social, copyright), floating WhatsApp, “Get a Quote” CTA, 404 page style.
- **Content:** All copy and media tailored to Burhani Traders (no Aaliqadar branding).

### 2.2 Out of Scope (Initial Release)
- Full e‑commerce (cart, checkout, payments).
- User accounts, login, and “Login to see prices” (can show “Inquire for price” or placeholder pricing).
- Multi-language (can be added later).
- Blog or news section (unless explicitly requested).
- Advanced search filters and faceted navigation (simple search only in Phase 1).

---

## 3. User Stories & Requirements

### 3.1 Visitor – Homepage
- As a visitor I can see a clear hero with key message and “Shop Now” so I understand what the company offers.
- As a visitor I can see featured brands and product categories so I can explore by category.
- As a visitor I can see featured/top products with category and brand so I can consider inquiring.
- As a visitor I can see company stats (e.g. brands, categories, clients, years) so I trust the business.
- As a visitor I can click “Get a Quote” or WhatsApp to inquire.

### 3.2 Visitor – Products
- As a visitor I can open a Products listing (or category index) and see product cards.
- As a visitor I can open a category (e.g. Power Tools, Measuring Tools) and see products in that category.
- As a visitor I can see product name, category, brand, and price or “Inquire for price.”
- As a visitor I can open a product detail (if implemented) to see description and inquire.

### 3.3 Visitor – About
- As a visitor I can read who Burhani Traders is, why choose them, and their vision.
- As a visitor I can see “Our Clients” or partners if content is provided.

### 3.4 Visitor – Contact
- As a visitor I can see address, email, and phone.
- As a visitor I can submit an enquiry form (Name, Email, Message) and get confirmation.
- As a visitor I can open WhatsApp from a floating button or link.

### 3.5 Global
- As a visitor I can use the site on mobile and desktop with readable layout and touch-friendly controls.
- As a visitor I can use skip links and clear navigation (Home, Products, About, Contact).
- As a visitor I can search for products (simple search in scope).
- As a visitor I see a consistent header and footer on all pages.

---

## 4. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Responsive layout (mobile, tablet, desktop) | Must |
| FR-2 | Homepage with hero carousel (min 2–3 slides) | Must |
| FR-3 | Brand logos strip on homepage | Must |
| FR-4 | Product categories grid with links and product counts (or placeholders) | Must |
| FR-5 | Featured products section (cards: image, title, category, brand, price/CTA) | Must |
| FR-6 | Stats section (e.g. Brands, Categories, Clients, Years) | Must |
| FR-7 | “Must-have” / category highlight section | Should |
| FR-8 | “Engineered for real work” + similar products block | Should |
| FR-9 | CTA banner “Get a Quote” with supporting text | Must |
| FR-10 | Header: logo, main nav (Home, Products, About, Contact), search, top bar (phone, email, Inquire) | Must |
| FR-11 | Footer: sitemap links, product categories, contact, social links, copyright | Must |
| FR-12 | Products/category listing page(s) with product cards | Must |
| FR-13 | Product detail page (basic: image, title, description, category, brand, CTA) | Should |
| FR-14 | About page: intro, Why Us, Vision, optional client logos | Must |
| FR-15 | Contact page: contact details + form (Name, Email, Message) | Must |
| FR-16 | Contact form submission (e.g. email or serverless function; no backend required for static) | Should |
| FR-17 | Floating WhatsApp button linking to business number | Must |
| FR-18 | “Get a Quote” link (same as Contact or dedicated CTA) | Must |
| FR-19 | 404 page with search and CTA | Should |
| FR-20 | Search (client-side or simple backend) for products | Should |

---

## 5. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | Page load: LCP within 2.5s on 4G; images optimized (WebP, lazy load). |
| NFR-2 | Accessibility: semantic HTML, skip links, focus states, alt text, WCAG 2.1 AA where feasible. |
| NFR-3 | SEO: meta titles/descriptions, heading hierarchy, clean URLs, optional sitemap. |
| NFR-4 | Browser support: latest Chrome, Firefox, Safari, Edge; graceful degradation. |
| NFR-5 | No hard dependency on WordPress; stack chosen per Tech Stack doc. |

---

## 6. Content & Branding

- **Brand name:** Burhani Traders  
- **Tagline:** To be defined (reference: “TOOLS FOR PROFESSIONALS & DIYERS”).  
- **Logo:** To be supplied; placeholder used until then.  
- **Contact:** Address, phone, email, WhatsApp number for Burhani Traders.  
- **Categories:** Define list (e.g. from reference: Automotive, Building, Joining, Measuring, Mechanical, Pneumatic, Power Tools, Power Tool Accessories, Tool Storage, Tools for Electricians, Tools for Plumbers).  
- **Products:** Sample or real products with name, category, brand, image, price or “Inquire for price.”  
- **About:** Company story, Why Us bullets, Vision paragraph; “Our Clients” optional.  

---

## 7. Success Criteria

- All Must-have functional requirements implemented and working.
- Site is responsive and passes basic accessibility checks.
- Contact form delivers enquiries (or shows success state if backend deferred).
- WhatsApp and “Get a Quote” work from all key pages.
- Content is 100% Burhani Traders (no Aaliqadar branding in copy or images).

---

## 8. References

- Reference site: [https://aaliqadar.ae/](https://aaliqadar.ae/)
- Design doc: `docs/DESIGN.md`
- Tech stack: `docs/TECH-STACK.md`
- Implementation todo: `docs/TODO.md`
