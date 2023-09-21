import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const requests = req.body;

    if (!Array.isArray(requests) || requests.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: 'Missing required fields' });
    }

    for (let i = 0; i < requests.length; i++) {
      const { accountId, itemid, type, count, coins } = requests[i];

      if (!accountId || !itemid || !type || !count || !coins) {
        return res
          .status(400)
          .json({ success: false, error: 'Missing required fields' });
      }
    }

    try {
      const allPromises = [];

      const totalCost = requests.reduce(
        (acc, request) => acc + request.coins * request.count,
        0,
      );

      const findAccount = await prisma.accounts.findUnique({
        where: {
          id: requests[0].accountId,
        },
      });

      if (!findAccount) {
        throw new Error('Account not found');
      }

      if (findAccount.coins < totalCost) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Insufficient coins in the account',
          });
      }

      for (const request of requests) {
        const orderCreatePromise = prisma.shop_orders.create({
          data: {
            accountId: request.accountId,
            itemid: request.itemid,
            type: request.type,
            count: request.count,
            coins: request.coins,
          },
        });

        allPromises.push(orderCreatePromise);
      }

      const updateAccountPromise = prisma.accounts.update({
        where: { id: requests[0].accountId },
        data: {
          coins: findAccount.coins - totalCost,
        },
      });

      allPromises.push(updateAccountPromise);

      await prisma.$transaction(allPromises);

      res
        .status(201)
        .json({ success: true, data: 'Orders were created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
};

export default handler;
