import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { loginAdmin, isAdmin } from "@/lib/admin";
import { rateLimit, maybeCleanup } from "@/lib/rate-limit";

export const metadata = { title: "Admin · Login · Bosque" };

async function loginAction(formData: FormData) {
  "use server";

  // Rate limit fuerte: 5 intentos cada 15 min por IP. Bloquea brute force.
  maybeCleanup();
  const h = await headers();
  const clientKey = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`admin-login:${clientKey}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    redirect("/admin/login?error=ratelimit");
  }

  const token = String(formData.get("token") ?? "");
  const ok = await loginAdmin(token);
  if (ok) redirect("/admin");
  redirect("/admin/login?error=1");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const params = await searchParams;
  const hasError = params.error === "1";
  const isRateLimited = params.error === "ratelimit";

  return (
    <main className="min-h-screen bg-background-warm flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-background border border-border p-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none">
          Bosque
        </h1>
        <p className="mt-4 text-sm text-muted">
          Acceso interno. Pegá el token configurado en{" "}
          <code className="font-mono">ADMIN_TOKEN</code>.
        </p>
        <form action={loginAction} className="mt-6 space-y-4">
          <input
            name="token"
            type="password"
            required
            placeholder="Token"
            autoComplete="current-password"
            className="w-full border border-border bg-background-cream px-4 py-3 font-mono text-sm focus:outline-none focus:border-foreground"
          />
          <button
            type="submit"
            className="w-full bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
          >
            Entrar
          </button>
          {hasError && (
            <p className="text-sm text-frutos-rojos">Token inválido.</p>
          )}
          {isRateLimited && (
            <p className="text-sm text-frutos-rojos">
              Demasiados intentos. Esperá 15 minutos.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
