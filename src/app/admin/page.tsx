import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db, orders, isDbConfigured } from "@/db";
import { isAdmin, ADMIN_TOKEN_CONFIGURED } from "@/lib/admin";
import { formatArs } from "@/lib/format";
import { CARRIER_LABEL } from "@/lib/shipping";
import { PRODUCTS } from "@/data/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Bosque" };

async function logoutAction() {
  "use server";
  const { logoutAdmin } = await import("@/lib/admin");
  await logoutAdmin();
  redirect("/admin/login");
}

export default async function AdminPage() {
  if (!ADMIN_TOKEN_CONFIGURED) {
    return (
      <main className="min-h-screen bg-background-warm flex items-center justify-center p-6">
        <div className="max-w-lg text-center">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 font-display text-5xl uppercase">No configurado</h1>
          <p className="mt-4 text-sm text-muted">
            Configurá <code className="font-mono">ADMIN_TOKEN</code> (mínimo 8
            caracteres) en variables de entorno y volvé a desplegar.
          </p>
        </div>
      </main>
    );
  }
  if (!(await isAdmin())) redirect("/admin/login");

  const dbReady = isDbConfigured;
  const recentOrders = dbReady
    ? await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(50)
    : [];

  const stats = {
    total: recentOrders.length,
    paid: recentOrders.filter((o) => o.status === "paid").length,
    pending: recentOrders.filter((o) => o.status === "pending").length,
    failed: recentOrders.filter((o) => o.status === "failed").length,
    revenue: recentOrders
      .filter((o) => o.status === "paid")
      .reduce((s, o) => s + Number(o.totalArs), 0),
  };

  return (
    <main className="min-h-screen bg-background-cream">
      <header className="bg-background border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-xl uppercase">
              Bosque · Admin
            </Link>
            <nav className="hidden sm:flex items-center gap-6 text-[0.78rem] uppercase kerning-expanded">
              <Link href="/admin">Órdenes</Link>
              <Link href="/admin/productos">Productos</Link>
              <Link href="/" className="text-muted">
                Ver tienda
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button className="text-[0.78rem] uppercase kerning-expanded text-muted hover:text-foreground">
              Salir
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-6 sm:px-10 py-10">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Órdenes recibidas.</h1>
        {!dbReady && (
          <p className="mt-4 inline-block bg-frutos-rojos/10 border border-frutos-rojos text-frutos-rojos text-xs px-4 py-2 font-mono">
            DATABASE_URL no configurada — admin sin datos reales
          </p>
        )}

        <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Recibidas" value={String(stats.total)} />
          <Stat label="Pagadas" value={String(stats.paid)} />
          <Stat label="Pendientes" value={String(stats.pending)} />
          <Stat label="Ingresos (pagadas)" value={formatArs(stats.revenue)} />
        </dl>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 sm:px-10 pb-16">
        <div className="bg-background border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background-warm border-b border-border">
              <tr className="text-[0.7rem] uppercase kerning-expanded text-muted">
                <th className="px-4 py-3 text-left">Orden</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Envío</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">
                    {dbReady
                      ? "Todavía no hay órdenes."
                      : "Configurá DATABASE_URL para ver órdenes reales."}
                  </td>
                </tr>
              )}
              {recentOrders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-border hover:bg-background-warm"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    #{o.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-xs text-muted">{o.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    <p>
                      {CARRIER_LABEL[o.shippingCarrier as keyof typeof CARRIER_LABEL]} ·{" "}
                      {o.shippingCity}
                    </p>
                    <p>{o.shippingProvince} · {o.shippingPostal}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-right">
                    {formatArs(Number(o.totalArs))}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 sm:px-10 pb-16">
        <p className="eyebrow">Productos en catálogo</p>
        <h2 className="mt-3 text-3xl sm:text-4xl">
          {PRODUCTS.length} referencias activas.
        </h2>
        <p className="mt-2 text-sm text-muted">
          En esta versión los productos viven en{" "}
          <code className="font-mono text-foreground">src/data/products.ts</code>{" "}
          (hardcoded). Para CRUD vía DB hay que correr el seed y migrar a la
          tabla <code className="font-mono text-foreground">products</code>.
        </p>
        <div className="mt-6 bg-background border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background-warm border-b border-border">
              <tr className="text-[0.7rem] uppercase kerning-expanded text-muted">
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-left">Lote</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.slug} className="border-b border-border">
                  <td className="px-4 py-3">
                    <Link
                      href={`/tienda/${p.slug}`}
                      className="font-display uppercase text-base hover:text-cacao"
                    >
                      {p.shortName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.category}</td>
                  <td className="px-4 py-3 font-mono text-right">
                    {formatArs(p.priceArs)}
                  </td>
                  <td className="px-4 py-3 font-mono text-right">{p.stock}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {String(p.batchNumber).padStart(3, "0")} / {p.batchSize}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-display text-4xl uppercase leading-none">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "Pagada", cls: "bg-menta-glacial/15 text-menta-glacial" },
    pending: { label: "Pendiente", cls: "bg-dulce-leche/20 text-dulce-leche" },
    failed: { label: "Rechazada", cls: "bg-frutos-rojos/15 text-frutos-rojos" },
    shipped: { label: "Enviada", cls: "bg-cacao/15 text-cacao" },
    delivered: { label: "Entregada", cls: "bg-cacao/15 text-cacao" },
  };
  const meta = map[status] ?? { label: status, cls: "bg-muted/20 text-muted" };
  return (
    <span
      className={`inline-block px-2 py-1 text-[0.7rem] uppercase kerning-expanded ${meta.cls}`}
    >
      {meta.label}
    </span>
  );
}
