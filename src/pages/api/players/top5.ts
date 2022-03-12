import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';
import apiHandler from 'src/middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const players = await prisma.players.findMany({
    orderBy: { level: 'desc' },
    select: { name: true, level: true },
  });

  res.json({ success: true, args: { players } });
};

export default apiHandler({
  get,
});
