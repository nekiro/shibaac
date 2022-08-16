import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  res.json([
    { name: 'Nekir', vocation: 'Knight', level: 2 },
    { name: 'Sxxx', vocation: 'Sorcerer', level: 15 },
  ]);
};

export default apiHandler({
  get,
});
