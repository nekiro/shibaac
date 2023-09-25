import type { NextApiRequest, NextApiResponse } from 'next';
import {
  generateAccessToken,
  handleResponse,
} from '../../../../../lib/paypalUtils';

const base = 'https://api-m.sandbox.paypal.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { orderId } = req.query;

      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders/${orderId}/capture`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { jsonResponse, httpStatusCode } = await handleResponse(response);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error('Failed to capture order:', error);
      res.status(500).json({ error: 'Failed to capture order.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
