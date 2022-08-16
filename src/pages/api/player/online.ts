import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';
import apiHandler from '../../../middleware/apiHandler';

//TODO fix this and top5 to single api route with query parameters

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const players = await prisma.player_online.findMany({
      select: { player: true },
    });

    res.json({ success: true, args: { players } });
  } catch (err) {
    res.json({ success: false });
  }
};

export default apiHandler({
  get,
});
