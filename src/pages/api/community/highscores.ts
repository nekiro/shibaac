import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';
import apiHandler from '../../../middleware/apiHandler';

const DEFAULT_LIMIT = 10;

const get = async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { vocation = 'all', category = 'Experience', page = '1' } = req.query;

    let filterVocation = vocation === 'all' ? 'all' : Number(vocation);
    let highscoresPlayer;

    let pagination = {
      page: Number(page),
      offset: (Number(page) - 1) * DEFAULT_LIMIT,
      limit: DEFAULT_LIMIT,
    };

    const order = [{ level: 'desc' }, { name: 'asc' }];

    let categoryFilter = {};
    if (category !== 'Experience') {
      if (typeof category === 'string') {
        categoryFilter = { [category]: { gte: 0 } };
      } else {
        return res.status(400).json({ error: 'Invalid category value' });
      }
    }

    let whereCondition = { ...categoryFilter };

    if (filterVocation !== 'all') {
      if (!isNaN(filterVocation)) {
        whereCondition.vocation = filterVocation;
      } else {
        return res.status(400).json({ error: 'Invalid vocation value' });
      }
    }

    const totalCount = await prisma.players.count({ where: whereCondition });

    highscoresPlayer = await prisma.players.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: order,
      where: whereCondition,
    });

    highscoresPlayer = highscoresPlayer.map((player: any) => {
      const newPlayer = { ...player };
      for (const [key, value] of Object.entries(newPlayer)) {
        if (typeof value === 'bigint') {
          newPlayer[key] = value.toString();
        }
      }
      return newPlayer;
    });

    res.setHeader('x-total-count', totalCount);

    return res
      .status(200)
      .json({ success: true, args: { data: highscoresPlayer } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export default apiHandler({
  get: get,
});
