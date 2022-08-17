import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  throw Error('Not Implemented');
};

export default apiHandler({
  get,
});
