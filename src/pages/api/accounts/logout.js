import { withSessionRoute } from 'src/util/session';

export default withSessionRoute(async (req, res) => {
  await req.session.destroy();
  res.json({ ok: true });
});
