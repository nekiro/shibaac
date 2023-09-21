import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const houses = await prisma.houses.findMany();
    return res.status(200).json({ success: true, args: { data: houses } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
