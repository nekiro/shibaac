import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'GET') {
    const { id } = req.query;

    const town = await prisma.towns.findFirst({ where: { id: Number(id) } });
    if (!town) {
      return res.status(200).json({ success: false, message: 'Not found' });
    }

    res.status(200).json({ success: true, args: { town } });
  }
};

export default handler;
