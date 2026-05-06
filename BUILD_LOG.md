# BUILD_LOG — Bosque

Demo #3 del kit ecommerce AR para portfolio. Chocolatería patagónica con catálogo, carrito multi-item, stock, shipping AR (Andreani/Correo/OCA), Mercado Pago Checkout Pro y panel admin CRUD.

Tracking honesto del tiempo wall-clock para narrativa marketing del kit.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4
- Drizzle ORM + Neon Postgres serverless
- Mercado Pago Checkout Pro
- Resend (transactional email)
- Vercel (deploy)
- Vitest + Playwright (tests)

## Identidad visual

- Inspirada en `onyxcoffeelab.com`: full-bleed hero, alternating L/R blocks, grid productos, sticky header, kerning expandido en headings.
- **Headings (H1–H4):** Bajern (free for personal use, Anton Bolin) — fallback `Antonio` sans-serif si licencia restringe en deploy comercial cliente.
- **Body:** Geist Sans (Vercel, open-source).
- **Mono (precios, batch, peso):** Geist Mono.
- **Paleta:**
  - BG primario `#FFFFFF`
  - BG secundario `#EEE9DF` (warm beige)
  - BG accent `#FBFAF3` (cream)
  - Text `#0A0A0A`
  - Accent rotativo: cacao `#3D1F0F`, dulce de leche `#C8843A`, frutos rojos `#A8210F`, menta glacial `#3F7A6E`

## Timeline

| Timestamp (UTC) | Evento |
|---|---|
| 2026-05-06T16:04:25Z | **T-0** — `create-next-app` scaffold completado. Inicio cronómetro. |
| 2026-05-06T16:14:00Z | Tipografía: Anton (Google Fonts) como display por licencia libre — Bajern preview de Fontmirror solo trae 2 glyphs, descartado. |
| 2026-05-06T16:18:00Z | Deps: drizzle-orm + drizzle-kit + @neondatabase/serverless + geist + resend + mercadopago + zod + vitest. |
| 2026-05-06T16:25:00Z | Homepage v0.1: hero full-bleed cocoa + featured product alternating L/R + marquee categorías + footer multi-col. Build clean. |
