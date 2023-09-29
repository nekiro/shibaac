import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';
import prisma from '../../../prisma';

const get = async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const totalPlayers = await prisma.players.count();
    res.status(200).json({ success: true, args: { players: totalPlayers } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total players.' });
  }
};

export default apiHandler({
  get: get,
});
