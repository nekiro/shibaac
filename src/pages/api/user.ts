import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../util/session';
import apiHandler from '../../middleware/apiHandler';

const get = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = req.session.user;
    if (!user) {
      return res.json({
        success: true,
        args: {
          isLoggedIn: false,
        },
      });
    }

    return res.json({
      success: true,
      args: {
        isLoggedIn: true,
        user,
      },
    });
  }
);

export default apiHandler({
  get,
});
