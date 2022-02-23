import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'GET') {
    const news = await prisma.aac_news.findMany();
    res.json({ success: true, args: { news } });
  }
};

export default handler;
