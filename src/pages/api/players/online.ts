import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'GET') {
    const players = await prisma.players.findMany({
      select: { name: true, level: true, vocation: true },
    });

    res.status(200).json({ success: true, args: { players } });
  }
};

export default handler;
