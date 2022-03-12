import { NextApiRequest, NextApiResponse } from 'next';
import { getCache } from 'src/cache/protocolStatus';
import apiHandler from 'src/middleware/apiHandler';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  res.json({ success: true, args: { status: await getCache() } });
};

export default apiHandler({
  get,
});
