import * as mercadopago from 'mercadopago';

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  throw new Error(
    'MERCADO_PAGO_ACCESS_TOKEN is not defined in the environment variables',
  );
}

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export default mercadopago;
