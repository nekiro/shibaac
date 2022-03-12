import { withSessionRoute } from 'src/util/session';
import { sha1Encrypt } from 'src/util/crypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';
import apiHandler from 'src/middleware/apiHandler';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = req.session;
    if (!user) {
      return res.status(403).json({ message: 'user not found' });
    }

    const { email, password } = req.body;

    const result = await prisma.accounts.updateMany({
      where: { id: user.id, password: sha1Encrypt(password) },
      data: {
        email,
      },
    });

    if (result.count == 0) {
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
