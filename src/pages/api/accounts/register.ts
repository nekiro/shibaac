import { sha1Encrypt } from 'src/util/crypt';
import { validate } from 'src/middleware/validation';
import { registerSchema } from 'src/schemas/Register';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';
import apiHandler from 'src/middleware/apiHandler';

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, password, email } = req.body;

  const count = await prisma.accounts.count({
    where: { name },
  });

  if (count !== 0) {
    return res.json({
      success: false,
      message: 'Account with that name already exists.',
    });
  }

  const account = await prisma.accounts.create({
    data: {
      name,
      password: sha1Encrypt(password),
      email,
    },
  });

  if (!account) {
    return res.json({
      success: false,
      message: 'Error occured while creating account',
    });
  }

  res.json({ success: true, message: 'Account created successfuly' });
};

export default apiHandler({
  post: validate(registerSchema, post),
});
