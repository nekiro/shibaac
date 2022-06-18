import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/prisma';
import apiHandler from 'src/middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const news = await prisma.aac_news.findMany();
  res.json({ success: true, args: { news } });
};

export default apiHandler({
  get,
});
