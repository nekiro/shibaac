import { withSessionRoute } from 'src/util/session';
import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from 'src/middleware/apiHandler';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.json({ success: true });
  }
);

export default apiHandler({
  post,
});
