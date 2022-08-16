import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../..//prisma';
import apiHandler from '../../../middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const news = await prisma.aac_news.findMany();
    res.json({ success: true, args: { news } });
  } catch (err) {
    res.json({ success: false });
  }
};

export default apiHandler({
  get,
});
