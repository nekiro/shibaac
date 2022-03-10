import { sha1Encrypt } from 'src/util/crypt';
import { validate } from 'src/middleware/validation';
import { registerSchema } from 'src/schemas/Register';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'POST') {
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
  }
};

export default validate(registerSchema, handler);
