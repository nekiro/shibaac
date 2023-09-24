import prisma from '../../../prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const group = 2;

  const players = await prisma.players.findMany({
    where: {
      group_id: {
        gt: group,
      },
    },
  });

  if (!players || players.length === 0) {
    return res.json({ success: false, message: 'Players not found' });
  }

  res.status(200).json({ success: true, args: { data: players } });
};

export default apiHandler({
  get,
});
