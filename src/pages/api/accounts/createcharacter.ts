import { withSessionRoute } from 'src/util/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { validate } from 'src/middleware/validation';
import { createCharacterSchema } from 'src/schemas/CreateCharacter';
import prisma from 'src/database/instance';

const handler = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = req.session.user;
    if (!user) {
      return res.status(403).json({ message: 'Not authorised.' });
    }

    const { name, vocation, sex } = req.body;

    const count = await prisma.players.count({
      where: { name },
    });

    if (count !== 0) {
      return res.json({
        success: false,
        message: 'Character with that name already exists',
      });
    }

    const character = await prisma.players.create({
      data: {
        name,
        account_id: user.id,
        vocation,
        sex,
      },
    });

    if (character) {
      res.json({ success: true, message: 'Succesfully created character.' });
    } else {
      res.json({ success: true, message: "Couldn't create character." });
    }
  }
);

export default validate(createCharacterSchema, handler);
