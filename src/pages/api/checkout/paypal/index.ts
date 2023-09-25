import type { NextApiRequest, NextApiResponse } from 'next';
import {
  generateAccessToken,
  handleResponse,
} from '../../../../lib/paypalUtils';
import prisma from '../../../../prisma';

const base = 'https://api-m.sandbox.paypal.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { data } = req.body;

      const accountId = data.accountId;
      const coins = data.coins;

      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders`;
      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'BRL',
              value: data.price,
            },
          },
        ],
      };

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const { jsonResponse, httpStatusCode } = await handleResponse(response);

      // Se a transação for completada, adicione os coins ao accountId.
      if (jsonResponse.status === 'COMPLETED') {
        try {
          await prisma.purchases.create({
            data: {
              accountId: Number(accountId),
              amount: coins,
              status: 'completed',
              paymentId: jsonResponse.id,
              paymentMethod: 'credit_card',
            },
          });

          const account = await prisma.accounts.findUnique({
            where: { id: Number(accountId) },
          });

          if (!account) {
            throw new Error('Account not found');
          }

          await prisma.accounts.update({
            where: { id: Number(accountId) },
            data: { coins: account.coins + coins },
          });

          console.log('🎉 Purchase record created in database!');
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({ success: false, error: 'Internal server error' });
        } finally {
          await prisma.$disconnect();
        }
      }

      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error('Failed to create order:', error);
      res.status(500).json({ error: 'Failed to create order.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
