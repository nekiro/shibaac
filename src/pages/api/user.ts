import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from 'src/util/session';
import apiHandler from 'src/middleware/apiHandler';

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
