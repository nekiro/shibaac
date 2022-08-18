import { sha1Encrypt } from '../../../lib/crypt';
import { withSessionRoute } from '../../../lib/session';
import { validate } from '../../../middleware/validation';
import { loginSchema } from '../../../schemas/Login';
import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';
import * as accountService from '../../../services/accountService';

export const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, password } = req.body;

    const account = await accountService.getAccountBy(
      { name, password: await sha1Encrypt(password) },
      { id: true, name: true }
    );

    if (!account) {
      return res
        .status(401)
        .json({ success: false, message: 'Wrong credentials.' });
    }

    req.session.user = account;
    await req.session.save();
    res.json({ success: true, args: { account } });
  }
);

export default apiHandler({
  post: validate(loginSchema, post),
});
