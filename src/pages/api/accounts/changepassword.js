import { withSessionRoute } from 'src/util/session';
import { AccountEntity } from 'src/database';
import { sha1Encrypt } from '../../../util/crypt';

export default withSessionRoute(async (req, res) => {
  const { user } = req.session;
  if (!user) {
    return res.status(403).json({ message: 'user not found' });
  }

  const { newPassword, password } = req.body;

  if (newPassword === password) {
    return res.json({
      success: false,
      message: "Current password can't be the same as new password.",
    });
  }

  const result = await AccountEntity.update(
    { password: sha1Encrypt(newPassword) },
    {
      where: {
        id: user.id,
        password: sha1Encrypt(password),
      },
    }
  );

  if (result[0] == 0) {
    return res.json({
      success: false,
      message: "Current password doesn't match.",
    });
  }

  res.json({ success: true, message: 'Succesfully changed password.' });
});
