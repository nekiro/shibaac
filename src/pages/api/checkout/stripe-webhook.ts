import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers['stripe-signature']!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('⚠️ Webhook Error: Unable to verify signature');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('💰 Payment successful!', paymentIntent);

      const accountId = paymentIntent.metadata.accountId;
      const amountReceived = paymentIntent.amount_received;
      const paymentMethod = paymentIntent.payment_method_types[0];

      try {
        await prisma.purchases.create({
          data: {
            accountId: Number(accountId),
            amount: amountReceived,
            status: 'completed',
            paymentId: paymentIntent.id,
            paymentMethod: paymentMethod,
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
          data: { coins: account.coins + amountReceived },
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

      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send('Received');
};
