import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';
import apiHandler from 'src/middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const town = await prisma.towns.findFirst({ where: { id: Number(id) } });
  if (!town) {
    return res.json({ success: false, message: 'Not found' });
  }

  res.json({ success: true, args: { town } });
};

export default apiHandler({
  get,
});
