import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';
import apiHandler from '../../../middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const players = await prisma.player.findMany({
    orderBy: { level: 'desc' },
    select: { name: true, level: true },
  });

  res.json({ success: true, args: { players } });
};

export default apiHandler({
  get,
});
