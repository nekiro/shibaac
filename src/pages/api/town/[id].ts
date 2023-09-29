import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';
import apiHandler from '../../../middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const town = await prisma.towns.findFirst({ where: { id: Number(id) } });
  if (!town) {
    return res.status(404).json({ success: false, message: 'Town not found.' });
  }

  res.json({ success: true, args: { town } });
};

export default apiHandler({
  get,
});
