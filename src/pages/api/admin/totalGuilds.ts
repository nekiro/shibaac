import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';
import prisma from '../../../prisma';

const get = async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const totalGuilds = await prisma.guilds.count();
    res.status(200).json({ success: true, args: { guilds: totalGuilds } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total guilds.' });
  }
};

export default apiHandler({
  get: get,
});
