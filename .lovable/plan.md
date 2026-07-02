# GrandDecore — Luxury Home Decor Ecommerce

A premium Shopify-style storefront + admin panel built on TanStack Start, Tailwind, Shadcn UI, and Lovable Cloud (Supabase). Brand: emerald `#22C55E` on white, near-black text, editorial typography (Playfair Display + Inter), generous spacing, cinematic motion.

## Scope

### Storefront (public)
- **Home** — hero video slider (autoplay, multi-slide, smooth transitions), featured categories, best sellers, new arrivals, trending, why-choose-us, reviews, brand story, decor inspiration gallery, Instagram grid, newsletter, CTA banner.
- **Shop** — search, category/price/sort filters, responsive product grid, pagination.
- **Product** — gallery + video, hover zoom, variant selector, dynamic price/inventory, sticky Add-to-Cart & Buy-Now, reviews, specs, FAQ, shipping/refund info, related / FBT / recently viewed / recommended sections.
- **About**, **Contact** (with WhatsApp `03238041309`), **Track Order** (lookup by order # + phone).
- **Policies**: Privacy, Refund, Shipping, Return, Cookie, Terms.
- **Cart drawer** — slide-from-right, qty controls, remove, subtotal, checkout CTA.
- **Checkout** — Pakistan COD only. Fields: full name, phone, WhatsApp, city, full address. Trust badges + secure-checkout indicators + COD info. Submits order to DB and confirms.
- **Product card hover** — image zoom, secondary image swap, Quick View modal, Add to Cart, Wishlist.

### Admin (`/admin`, protected)
- Email/password auth, `admin` role enforced via `user_roles` + `has_role` (RLS-safe).
- **Dashboard**: total sales, revenue, orders, products, customers, monthly revenue chart (Recharts).
- **Products**: CRUD, categories, variants, inventory, images, videos.
- **Orders**: status workflow Pending → Confirmed → Shipped → Delivered → Cancelled.
- **Customers**: list + per-customer order history.
- **Analytics**: revenue/sales reports, top products, order stats.
- **Settings**: logo upload, store info, WhatsApp number, social links.

### Motion & polish
Framer Motion scroll reveals, page transitions, hover micro-interactions, marquee, parallax hero. Editorial luxury aesthetic — not generic SaaS.

## Tech / Data

- **Stack**: TanStack Start + React 19 + Vite + Tailwind v4 + Shadcn UI + Framer Motion + Recharts + Lovable Cloud.
- **State**: Zustand for cart + wishlist + recently-viewed (localStorage persisted).
- **Seed data**: realistic dummy categories (Vases, Wall Art, Lighting, Mirrors, Candles, Textiles, Sculptures, Planters), ~24 products w/ multi-images & variants, dummy reviews — seeded via migration so admin can manage afterward.

### Supabase schema
```
app_role enum (admin, customer)
user_roles (user_id, role)            -- RLS-safe role checks via has_role()
categories (id, name, slug, image, sort)
products (id, name, slug, description, price, compare_price,
          category_id, images[], videos[], specs jsonb,
          inventory, is_featured, is_new, is_trending, is_best_seller, created_at)
product_variants (id, product_id, name, options jsonb, price_delta, inventory)
reviews (id, product_id, customer_name, rating, title, body, created_at)
orders (id, order_number, full_name, phone, whatsapp, city, address,
        items jsonb, subtotal, shipping, total, status, notes, created_at)
order_items (denormalized inside orders.items jsonb for simplicity + queries)
store_settings (singleton: logo, store_name, whatsapp, socials jsonb, policies jsonb)
```
RLS: public SELECT on products/categories/reviews/store_settings; admin-only writes via `has_role(auth.uid(),'admin')`; orders INSERT open to anon (COD), SELECT admin-only, plus public lookup RPC `track_order(order_number, phone)`.

### Routing
File-based under `src/routes/`:
- `index.tsx`, `shop.tsx`, `product.$slug.tsx`, `about.tsx`, `contact.tsx`, `track-order.tsx`, `checkout.tsx`, `order-success.$orderNumber.tsx`
- `policies/privacy.tsx`, `refund.tsx`, `shipping.tsx`, `return.tsx`, `cookie.tsx`, `terms.tsx`
- `_authenticated/admin/` layout + dashboard, products, products.$id, orders, orders.$id, customers, analytics, settings
- `auth.tsx` for admin login

### Out of scope (so I can finish in one pass)
- Real payment gateway (COD only, as requested).
- Real Instagram API — grid uses curated images.
- Email notifications.
- Multi-language / multi-currency.
- Real shipping rate calculation (flat-rate shown).

## Build order
1. Enable Lovable Cloud, create schema + seed migration, RLS, storage bucket for product media.
2. Design system: tokens in `src/styles.css`, Playfair + Inter, button/card variants, motion primitives.
3. Shared layout: announcement bar, header (search, cart, wishlist), mega-footer, cart drawer, quick-view modal.
4. Storefront pages in the order listed above.
5. Checkout + order creation + track-order RPC.
6. Admin auth gate + dashboard + product/order/customer/settings CRUD.
7. Sitemap, robots, SEO metadata per route, final polish pass.

Reply **approve** to start, or tell me what to change (e.g. fewer admin features, different palette accent, skip wishlist).