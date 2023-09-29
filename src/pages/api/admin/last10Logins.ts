import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';
import prisma from '../../../prisma';

const get = async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfDayTimestamp = BigInt(startOfDay.getTime());

    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);
    const endOfDayTimestamp = BigInt(endOfDay.getTime());

    const lastLogins = await prisma.players.findMany({
      where: {
        lastlogin: {
          gte: startOfDayTimestamp,
          lte: endOfDayTimestamp,
        },
      },
    });

    res.status(200).json({ success: true, args: { logins: lastLogins } });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch players who logged in today.' });
  }
};

export default apiHandler({
  get: get,
});
