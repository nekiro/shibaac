import { sha1Encrypt } from '../../../lib/crypt';
import { withSessionRoute } from '../../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../middleware/apiHandler';
import * as accountService from '../../../services/accountService';
import speakeasy from 'speakeasy';

export const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, password, twoFAToken } = req.body;

    try {
      const account = await accountService.getAccountBy(
        { name, password: await sha1Encrypt(password) },
        {
          id: true,
          name: true,
          twoFAEnabled: true,
          twoFASecret: true,
          type: true,
        },
      );

      if (!account) {
        return res
          .status(401)
          .json({ success: false, message: 'Wrong credentials.' });
      }

      if (account.twoFAEnabled) {
        console.log('Secret:', account.twoFASecret);
        console.log('Token:', twoFAToken);
        const verified = speakeasy.totp.verify({
          secret: String(account.twoFASecret),
          encoding: 'base32',
          token: twoFAToken,
          window: 2,
        });

        if (!verified) {
          return res.json({ success: false, message: 'Wrong 2FA token.' });
        }
      }

      req.session.user = account;
      await req.session.save();
      res.json({ success: true, args: { account } });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },
);

export default apiHandler({
  post: post,
});
