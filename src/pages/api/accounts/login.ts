import { sha1Encrypt } from 'src/util/crypt';
import { withSessionRoute } from 'src/util/session';
import { validate } from 'src/middleware/validation';
import { loginSchema } from 'src/schemas/Login';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/prisma';
import apiHandler from 'src/middleware/apiHandler';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, password } = req.body;

    const account = await prisma.accounts.findFirst({
      where: { name, password: sha1Encrypt(password) },
      select: { id: true, name: true },
    });

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
