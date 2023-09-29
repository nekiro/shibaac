import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';
import prisma from '../../../prisma';

const get = async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const totalAccounts = await prisma.accounts.count();
    res.status(200).json({ success: true, args: { accounts: totalAccounts } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total accounts.' });
  }
};

export default apiHandler({
  get: get,
});
