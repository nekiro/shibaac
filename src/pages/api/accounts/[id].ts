import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'GET') {
    //TODO: accept query parameters to pull only required data

    const account = await prisma.accounts.findFirst({
      where: {
        id: Number(req.query.id),
      },
      include: { players: { select: { name: true, level: true } } },
    });

    if (!account) {
      return res.json({ success: false, message: 'Account not found' });
    }

    res.status(200).json({ success: true, args: { account } });
  }
};

export default handler;
