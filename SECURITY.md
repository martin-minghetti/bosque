# Security Audit · Bosque

Audit y hardenings aplicados. Última revisión: 2026-05-06.

## Resumen ejecutivo

| Área | Status |
|---|---|
| Authentication / authorization | ✅ |
| Input validation | ✅ |
| Cookie + session security | ✅ |
| Webhook signature | ✅ |
| Rate limiting | ✅ |
| Email injection | ✅ |
| Security headers + CSP | ✅ |
| IDOR (post-fix) | ✅ |

## Vulnerabilidades encontradas y corregidas

### 1. IDOR en `/checkout/exito` y `/checkout/simulated` — **fixed**

**Severity:** alta. Cualquier UUID v4 válido en `?orderId=X` exponía el detalle completo de orden ajena: nombre, email, teléfono, dirección de envío, items y total.

**Vector:** `GET /checkout/exito?orderId=<uuid>` sin verificación de ownership.

**Fix:** token HMAC-SHA256 derivado de `SESSION_SECRET + orderId`, slice 32 chars hex, comparado con `timingSafeEqual`. URL pública pasa `?orderId=X&token=Y`. Sin token correcto → `notFound()`. No requiere DB lookup adicional.

Implementación: `src/lib/order-token.ts`. Tests: `tests/unit/order-token.test.ts` (7 casos).

### 2. Email HTML injection en `customerName`, dirección — **fixed**

**Severity:** media. El HTML del email confirmación interpolaba `customerName`, `shippingAddress`, `shippingCity`, `shippingProvince`, `shippingPostal` y carrier label sin escape. Un atacante podía inyectar `<script>` o iframe en el email del cliente o de oncall (si lee inbox copy del nombre).

**Fix:** función `escapeHtml()` aplicada a todos los strings del usuario antes de interpolación. `src/lib/email.ts`.

### 3. Rate limit ausente en endpoints sensibles — **fixed**

**Severity:** media. Brute-force del `ADMIN_TOKEN` no tenía freno (16 char hex = infeasible práctico, pero defense-in-depth). Tampoco había límite en checkout (DoS por crear órdenes basura) ni en add-to-cart.

**Fix:** in-memory rate limiter por IP (`src/lib/rate-limit.ts`).
- `/admin/login`: **5 intentos / 15 min** por IP. Tras llegar al límite, mensaje user-facing.
- `createOrderAction`: **10 órdenes / 5 min** por IP.
- `addToCartAndRedirect`: **60 adds / min** por IP.

Best-effort en serverless: cada instancia tiene su propio Map. Para límite estricto distribuido, swap a Upstash Redis.

Tests: `tests/unit/rate-limit.test.ts` (5 casos).

### 4. CSP ausente — **fixed**

**Severity:** baja-media. Faltaba Content-Security-Policy en headers. Los demás headers (HSTS, X-Frame DENY, X-Content nosniff, Permissions-Policy, Referrer) ya estaban.

**Fix:** CSP estricto en `next.config.ts`:
- `default-src 'self'`
- `connect-src` whitelist a `api.mercadopago.com` y `api.replicate.com`
- `form-action` whitelist a MP checkout domains
- `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`
- `upgrade-insecure-requests`

Note: `'unsafe-inline'` para scripts/styles es requerido por Next App Router para hidration. Trade-off conocido.

## Hardenings preexistentes

### Autenticación admin
- `ADMIN_TOKEN` env var (mín 8 chars).
- Cookie `httpOnly` + `secure` (prod) + `sameSite=lax`, max-age 14 días.
- Comparación con `timingSafeEqual` para evitar timing side-channels.
- Si `ADMIN_TOKEN` no está configurado, `/admin` muestra mensaje de no-config (no crash).

### Cookies de sesión carrito
- `bosque_sid` cookie firmada HMAC-SHA256 con `SESSION_SECRET`.
- Formato `<uuid>.<sig>`, verificada con `timingSafeEqual`.
- `httpOnly` + `secure` (prod) + `sameSite=lax`, max-age 30 días.
- `SESSION_SECRET` mínimo 16 chars en prod (throw si falta).

### Mercado Pago webhook
- `POST /api/mp/webhook` verifica HMAC-SHA256 con `MP_WEBHOOK_SECRET`.
- Manifest: `id:{dataId};request-id:{xRequestId};ts:{ts};` (formato MP).
- Timestamp freshness ≤ 5 min para evitar replay attacks.
- Si firma inválida → 401, sin pista de qué falló.
- Si `MP_WEBHOOK_SECRET` no configurado → ignora silenciosamente (no procesa nada, devuelve `{ok:true,ignored}`).

### Input validation
- Todos los server actions usan zod schemas:
  - `addToCartAction`: slug max 120 chars, qty 1-20.
  - `setCartLineAction`: slug max 120 chars, qty 0-20.
  - `createOrderAction`: nombre 2-120, email, teléfono opcional, postal regex AR `^[A-Z]?\d{4}([A-Z]{3})?$`, carrier enum, notas max 500.
- En MP webhook: parse JSON con try/catch, type guards en payload.

### SQL injection
- Drizzle ORM siempre parametriza queries. No string interpolation directa.

### Database access scoping
- Cliente Neon con `import "server-only"` para garantizar que nunca llega a bundle cliente.
- Sin policies row-level (es Postgres standalone, no Supabase con RLS). Toda query corre con privilegios de service account; la lógica de autorización vive en application layer.

### Secrets
- `.env*` ignorados en git, `!.env.example` permitido.
- Vercel envs encryptedy scoped por environment.
- Sin secretos hardcoded en source.

## Threat model resumido

**Activos:** datos de órdenes (PII de cliente), credenciales MP/Resend, integridad del catálogo, integridad del precio.

**Adversarios:**
1. Atacante público anónimo intentando IDOR / path enumeration.
2. Atacante con cuenta cliente legítima intentando ver órdenes ajenas.
3. Atacante que comprometió 1 cookie de sesión robada.
4. Brute force del admin token.

**No-cubiertos (out of scope para demo):**
- DDoS volumétrico (mitigado por Vercel infra, no por app).
- Timing attacks distribuidos contra HMAC (mitigado por `timingSafeEqual`).
- Replay attack del webhook MP en ventana < 5 min (mitigado por `external_reference` único + `mp_payment_id` único en DB).

## Tests

- `tests/unit/session.test.ts` — HMAC roundtrip, tampering rejection, format validation.
- `tests/unit/order-token.test.ts` — IDOR guard, cross-order rejection, length checks.
- `tests/unit/rate-limit.test.ts` — bucket isolation, window reset, limit enforcement.
- `tests/e2e/navigation.spec.ts` — happy path navigation contra live deploy.

## Pendientes / nice-to-have

- [ ] Rate limiter distribuido (Upstash Redis) para serverless multi-instance.
- [ ] CSRF nonces para forms públicos (Next 16 ya tiene origin check automático para server actions).
- [ ] WAF / Cloudflare Turnstile en `/admin/login` para bloquear bots.
- [ ] Logs structured con request-id correlación.
- [ ] Auditoría de dependencies: `pnpm audit` en CI.
