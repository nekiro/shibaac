import { sha1Encrypt } from '../../../util/crypt';
import { withSessionRoute } from '../../../util/session';
import { validate } from '../../../middleware/validation';
import { loginSchema } from '../../../schemas/Login';
import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';
import * as accountService from '../../../services/accountService';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, password } = req.body;

    const account = await accountService.getAccountBy(
      { name, password: sha1Encrypt(password) },
      { id: true, name: true }
    );

    if (!account) {
      return res.json({ success: false, message: 'Wrong credentials.' });
    }

    req.session.user = account;
    await req.session.save();
    res.json({ success: true, args: { account } });
  }
);

export default apiHandler({
  post: validate(loginSchema, post),
});
