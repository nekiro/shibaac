import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';
import prisma from '../../../prisma';

const get = async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const topCoins = await prisma.accounts.findMany({
      take: 10,
      orderBy: {
        coins: 'desc',
      },
      select: {
        coins: true,
        players: { select: { name: true, id: true } },
      },
    });

    res.status(200).json({ success: true, args: { coins: topCoins } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top 10 players by coins.' });
  }
};

export default apiHandler({
  get: get,
});
