import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from '../../../lib/mercadopagoConfig';

const prisma = new PrismaClient();

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(
        'https://api.mercadopago.com/v1/payment_methods',
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const resultMercadoPago = await response.json();

      res
        .status(200)
        .json({ success: true, args: { data: resultMercadoPago } });
      return;
    } catch (error) {
      console.error('Failed to get Mercado Pago methods', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      if (
        !req.body.transaction_amount ||
        !req.body.description ||
        !req.body.external_reference ||
        !req.body.payer?.email ||
        !req.body.additional_info?.items
      ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const preference = {
        items: req.body.additional_info.items.map((item: any) => ({
          title: item.title,
          unit_price: item.unit_price,
          quantity: item.quantity,
        })),
        payer: {
          email: req.body.payer.email,
          first_name: req.body.payer.first_name || '',
          last_name: req.body.payer.last_name || '',
        },
        external_reference: req.body.external_reference,
        back_urls: {
          success: `${baseUrl}/donate/success`,
          failure: `${baseUrl}/donate/failure`,
          pending: `${baseUrl}/donate/pending`,
        },
        auto_return: 'approved',
      };

      const preferenceResponse = await mercadopago.preferences.create(
        preference,
      );

      try {
        await prisma.purchases.create({
          data: {
            accountId: Number(req.body.payer.accountId),
            amount: req.body.transaction_amount,
            status: 'completed',
            paymentId: preferenceResponse.body.id,
            paymentMethod: req.body.payment_method_id,
          },
        });

        const account = await prisma.accounts.findUnique({
          where: { id: Number(req.body.payer.accountId) },
        });

        if (!account) {
          throw new Error('Account not found');
        }

        await prisma.accounts.update({
          where: { id: Number(req.body.payer.accountId) },
          data: {
            coins: account.coins + req.body.additional_info?.items[0].coins,
          },
        });

        console.log('🎉 Purchase record created in database!');
      } catch (err: any) {
        console.error(
          '⚠️ Database error: Unable to create purchase record',
          err,
        );
        return res.status(500).send('Database error');
      }

      return res.status(200).json({
        success: true,
        args: { data: preferenceResponse },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
