import { withSessionRoute } from '../../../util/session';
import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.json({ success: true });
  }
);

export default apiHandler({
  post,
});
