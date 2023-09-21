import { accounts } from '@prisma/client';
import { withSessionRoute } from '../../../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma';
import speakeasy from 'speakeasy';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { token } = req.body;
      const user = req.session.user as accounts;

      if (!user) {
        return res.status(403).json({ message: 'Not authorized.' });
      }

      const verified = speakeasy.totp.verify({
        secret: String(user.twoFASecret),
        encoding: 'base32',
        token,
      });

      if (verified) {
        await prisma.accounts.update({
          where: { id: user.id },
          data: { twoFAEnabled: true },
        });
        return res.json({ success: true });
      } else {
        return res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  },
);

const handleTwoFactorVerification = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  switch (req.method) {
    case 'POST':
      return post(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handleTwoFactorVerification;
