import "server-only";
import { MercadoPagoConfig } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN;

export const mpClient = accessToken
  ? new MercadoPagoConfig({
      accessToken,
      options: { timeout: 8000 },
    })
  : null;

export const mpPaymentMode: "production" | "simulated" =
  process.env.PAYMENT_MODE === "production" && mpClient ? "production" : "simulated";
