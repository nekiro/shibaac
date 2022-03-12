import { withSessionRoute } from 'src/util/session';
import { sha1Encrypt } from 'src/util/crypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';
import apiHandler from 'src/middleware/apiHandler';
import { changePasswordSchema } from 'src/schemas/ChangePassword';
import { validate } from 'src/middleware/validation';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
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

    const result = await prisma.accounts.updateMany({
      where: {
        id: user.id,
        password: sha1Encrypt(password),
      },
      data: { password: sha1Encrypt(newPassword) },
    });

    if (result.count === 0) {
      return res.json({
        success: false,
        message: "Current password doesn't match.",
      });
    }

    res.json({ success: true, message: 'Succesfully changed password.' });
  }
);

export default apiHandler({
  post: validate(changePasswordSchema, post),
});
