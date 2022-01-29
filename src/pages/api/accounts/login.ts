import { AccountEntity } from 'src/database';
import { sha1Encrypt } from 'src/util/crypt';
import { withSessionRoute } from 'src/util/session';
import { validate } from 'src/middleware/validation';
import { loginSchema } from 'src/schemas/Login';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, password } = req.body;

    const account = await AccountEntity.findOne({
      where: { name, password: sha1Encrypt(password) },
      attributes: ['id', `name`],
    });

    if (!account) {
      return res.json({ success: false, message: 'Wrong credentials.' });
    }

    req.session.user = account;
    await req.session.save();
    res.json({ success: true, args: { account } });
  }
);

export default validate(loginSchema, handler);
