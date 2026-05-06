# Bosque

Demo de tienda online para chocolatería patagónica. Tercera pieza del kit ecommerce AR (junto con [Norhaven Lodge](https://norhaven-lodge.vercel.app) — booking + MP Checkout Pro, y [Cohere](https://cohere-six.vercel.app) — membresías recurrentes con MP Subscriptions).

Construido como showcase técnico y carta de venta para comercios de Bariloche que necesitan alternativa a Tiendanube: stack moderno, customizable real, costo ~$0/mes en free tiers vs ~$15-30k/mes plan básico.

## Qué muestra

- Catálogo de productos con stock real
- Carrito multi-item server-side (cookie session_id)
- Checkout Mercado Pago one-shot con N items
- Shipping AR calculado (Andreani / Correo Argentino / OCA, 3 zonas)
- Panel admin CRUD para cargar productos sin tocar código
- Email transaccional (Resend) post-pago
- Identidad visual editorial inspirada en `onyxcoffeelab.com` adaptada a producto patagónico

## Stack

Next 16 + TS + Tailwind v4 + Drizzle + Neon Postgres + MP Checkout Pro + Resend + Vercel.

## Tracking

Tiempo wall-clock activo en [`BUILD_LOG.md`](./BUILD_LOG.md). T-0 = `2026-05-06T16:04:25Z`.

## Setup

```bash
pnpm install
cp .env.example .env.local   # completar credenciales
pnpm db:push
pnpm dev
```

## Licencias de tipografía

Las fuentes de heading (Bajern by Anton Bolin) son free para uso personal. Para deploy comercial real bajo cliente, ese cliente paga su licencia comercial en Creative Market o se hace swap a fallback (`Antonio` open-source). El demo `bosque.vercel.app` queda dentro de uso personal/portfolio.

## Repos relacionados del kit

- Norhaven Lodge: https://github.com/martin-minghetti/norhaven-lodge
- Cohere: https://github.com/martin-minghetti/cohere
