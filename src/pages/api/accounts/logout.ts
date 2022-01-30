import { withSessionRoute } from 'src/util/session';
import { NextApiRequest, NextApiResponse } from 'next';

export default withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.json({ success: true });
  }
);
