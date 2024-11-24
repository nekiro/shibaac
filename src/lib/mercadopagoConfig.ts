import { MercadoPagoConfig } from "mercadopago";

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
	throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not defined in the environment variables");
}

// TODO: move idempotencyKey to env
const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, options: { timeout: 5000, idempotencyKey: "abc" } });

export default mercadopago;
