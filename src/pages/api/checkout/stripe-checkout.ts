import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../lib/session';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Stripe Secret key not initialized.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(403).json({ message: 'Not authorized.' });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: process.env.NEXT_PUBLIC_CURRENCY || 'BRL',
              product_data: {
                name: process.env.NEXT_PUBLIC_PRODUCT_NAME || 'Tibia Coins',
              },
              unit_amount: req.body.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/donate/success`,
        cancel_url: `${req.headers.origin}/donate/failure`,
      });

      res.status(200).json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return post(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handleRequest;
