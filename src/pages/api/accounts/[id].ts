import { AccountEntity, PlayerEntity } from 'src/database';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'GET') {
    //TODO: accept query parameters to pull only required data

    const account = await AccountEntity.findByPk(req.query.id as string, {
      include: { model: PlayerEntity, attributes: ['name', 'level'] },
    });

    if (!account) {
      return res.json({ success: false, message: 'Account not found' });
    }

    res.status(200).json({ success: true, args: { account } });
  }
};

export default handler;
