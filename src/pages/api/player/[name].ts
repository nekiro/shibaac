import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';
import apiHandler from '../../../middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;

  const player = await prisma.players.findFirst({
    where: { name: String(name) },
    select: {
      accounts: {
        select: {
          players: { select: { name: true, level: true, vocation: true } },
        },
      },
      player_deaths: {
        take: 7,
        orderBy: { time: 'desc' },
      },
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
    const deathsWithDetails: any[] = [];

    for (let death of player.player_deaths) {
      const killer = await prisma.players.findFirst({
        where: { name: death.killed_by },
        select: { level: true, vocation: true },
      });

      if (killer) {
        deathsWithDetails.push({
          ...death,
          killerDetails: {
            level: killer.level,
            vocation: killer.vocation,
          },
        });
      } else {
        deathsWithDetails.push(death);
      }
    }

    const playerWithDetails = {
      ...player,
      player_deaths: deathsWithDetails,
    };

    res.json({ success: true, args: { player: playerWithDetails } });
  } else {
    res.status(404).json({ success: false, message: 'Not found.' });
  }
};

export default apiHandler({
  get,
});
