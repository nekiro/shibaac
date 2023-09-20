import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';

import speakeasy from 'speakeasy';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { token } = req.body;
    const user = req.session.user;

    if (!user) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
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
};
