import { withSessionRoute } from '../../../util/session';
import { sha1Encrypt } from '../../../util/crypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';
import apiHandler from '../../../middleware/apiHandler';
import { Prisma } from '@prisma/client';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = req.session;
    if (!user) {
      return res.status(403).json({ message: 'user not found' });
    }

    const { email, password } = req.body;

    let result: Prisma.BatchPayload | undefined;

    try {
      result = await prisma.account.updateMany({
        where: { id: user.id, password: sha1Encrypt(password) },
        data: {
          email,
        },
      });
    } catch (err) {}

    if (result && result.count == 0) {
      return res.json({
        success: false,
        message: "Current password doesn't match.",
      });
    }

    res.json({ success: true, message: 'Succesfully changed email.' });
  }
);

export default apiHandler({
  post,
});
