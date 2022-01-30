import { NewsEntity } from 'src/database';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'GET') {
    const news = await NewsEntity.findAll();
    res.status(200).json({ success: true, args: { news } });
  }
};

export default handler;
