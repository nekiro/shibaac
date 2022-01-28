import { withSessionRoute } from '../../util/session';

export default withSessionRoute(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.json({
      isLoggedIn: false,
    });
  }

  return res.json({
    isLoggedIn: true,
    ...user,
  });
});
