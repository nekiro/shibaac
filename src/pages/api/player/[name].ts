import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../..//prisma';
import apiHandler from '../../../middleware/apiHandler';

// TODO: this route should include info only on request, not always

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;

  try {
    const player = await prisma.player.findFirst({
      where: { name: String(name) },
      select: {
        account: {
          select: {
            premium_ends_at: true,
            players: { select: { name: true, level: true, vocation: true } },
          },
        },
        player_death: true,
        name: true,
        sex: true,
        vocation: true,
        level: true,
        lastlogin: true,
        group_id: true,
        town_id: true,
      },
    });

    if (player) {
      res.json({ success: true, args: { player } });
    } else {
      res.json({ success: false, message: 'Not found.' });
    }
  } catch (err) {
    res.json({ success: false });
  }
};

export default apiHandler({
  get,
});
