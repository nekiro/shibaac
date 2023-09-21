import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const getHouses = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const houses = await prisma.houses.findMany();
    return res.status(200).json({ success: true, args: { data: houses } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return getHouses(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handleRequest;
