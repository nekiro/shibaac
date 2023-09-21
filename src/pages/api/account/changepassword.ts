import { withSessionRoute } from '../../../lib/session';
import { sha1Encrypt } from '../../../lib/crypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';
import apiHandler from '../../../middleware/apiHandler';
import { changePasswordSchema } from '../../../schemas/ChangePassword';
import { validate } from '../../../middleware/validation';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = req.session;
    if (!user) {
      return res.status(403).json({ message: 'Unauthorised.' });
    }

    const { newPassword, password } = req.body;

    if (newPassword === password) {
      return res.status(400).json({
        success: false,
        message: "Current password can't be the same as new password.",
      });
    }

    const result = await prisma.accounts.updateMany({
      where: {
        id: user.id,
        password: await sha1Encrypt(password),
      },
      data: { password: await sha1Encrypt(newPassword) },
    });

    if (result.count === 0) {
      return res.status(400).json({
        success: false,
        message: "Current password doesn't match.",
      });
    }

    res.json({ success: true, message: 'Succesfully changed password.' });
  },
);

export default apiHandler({
  post: validate(changePasswordSchema, post),
});
