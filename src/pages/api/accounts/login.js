import { AccountEntity } from 'src/database';
import { sha1Encrypt } from 'src/util/crypt';
import { withSessionRoute } from 'src/util/session';

export default withSessionRoute(async (req, res) => {
  const account = await AccountEntity.findOne({
    where: { name: req.body.name, password: sha1Encrypt(req.body.password) },
    attributes: ['id', `name`],
  });

  if (!account) {
    return res.json({ success: false, message: 'Wrong credentials.' });
  }

  req.session.user = account;
  await req.session.save();
  res.json({ success: true, args: { account } });
});
