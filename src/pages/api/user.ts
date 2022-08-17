import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../lib/session';
import apiHandler from '../../middleware/apiHandler';

const get = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = req.session.user;

    return res.json({
      success: true,
      args: {
        isLoggedIn: !!user,
        user,
      },
    });
  }
);

export default apiHandler({
  get,
});
