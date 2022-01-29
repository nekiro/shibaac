import { withSessionRoute } from '../../util/session';

export default withSessionRoute(async (req, res) => {
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
});
