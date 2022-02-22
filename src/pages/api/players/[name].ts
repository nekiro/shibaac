import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'GET') {
    const { name } = req.query;

    const player: any = await prisma.players.findFirst({
      where: { name: String(name) },
      select: {
        accounts: {
          select: {
            premium_ends_at: true,
            players: { select: { name: true, level: true, vocation: true } },
          },
        },
        player_deaths: true,
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
  }
};

export default handler;
