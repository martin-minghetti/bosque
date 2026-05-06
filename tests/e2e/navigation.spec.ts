import { test, expect } from "@playwright/test";

test.describe("Navigation happy path", () => {
  test("home → tienda → product → carrito (sin DB)", async ({ page }) => {
    // 1. Home
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Chocolate/i,
    );
    await expect(page.getByRole("link", { name: /BOSQUE/ })).toBeVisible();

    // 2. Click "Ver tienda"
    await page.getByRole("link", { name: /Ver tienda/i }).first().click();
    await expect(page).toHaveURL(/\/tienda$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Tienda/i,
    );

    // 3. Click en un producto del catálogo
    const firstProduct = page
      .locator("a[href^='/tienda/']")
      .filter({ hasText: /[A-Za-z]/ })
      .first();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/tienda\/[a-z0-9-]+/);

    // 4. Verificar ficha técnica visible
    await expect(page.getByText(/Origen/i).first()).toBeVisible();
    await expect(page.getByText(/Batch/i).first()).toBeVisible();
    await expect(page.getByText(/Notas de cata/i)).toBeVisible();

    // 5. Botón "Agregar al carrito" visible
    await expect(
      page.getByRole("button", { name: /Agregar al carrito/i }),
    ).toBeVisible();

    // 6. Carrito link funciona
    await page.getByRole("link", { name: /Carrito \(/i }).click();
    await expect(page).toHaveURL(/\/carrito$/);
  });

  test("filtros de categoría funcionan", async ({ page }) => {
    await page.goto("/tienda");

    await page.getByRole("link", { name: /^Tabletas$/i }).first().click();
    await expect(page).toHaveURL(/\?cat=tabletas/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Tabletas/i,
    );
  });

  test("admin login redirige sin token", async ({ page }) => {
    const response = await page.goto("/admin");
    // Si ADMIN_TOKEN está configurado redirige a login;
    // si no está, muestra "No configurado"
    expect(response?.status()).toBe(200);
    const url = page.url();
    expect(url).toMatch(/\/admin(\/login)?/);
  });
});
