import { withSessionRoute } from 'src/util/session';
import { AccountEntity } from 'src/database';
import { sha1Encrypt } from 'src/util/crypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = req.session;
    if (!user) {
      return res.status(403).json({ message: 'user not found' });
    }

    const { email, password } = req.body;

    const result = await AccountEntity.update(
      { email },
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

    res.json({ success: true, message: 'Succesfully changed email.' });
  }
);
