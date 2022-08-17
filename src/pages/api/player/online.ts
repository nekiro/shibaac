import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';
import apiHandler from '../../../middleware/apiHandler';

//TODO fix this and top5 to single api route with query parameters

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const players = await prisma.player_online.findMany({
    select: { player: true },
  });

  res.json({ success: true, args: { players } });
};

export default apiHandler({
  get,
});
