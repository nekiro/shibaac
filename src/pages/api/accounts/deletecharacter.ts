import { withSessionRoute } from 'src/util/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { sha1Encrypt } from 'src/util/crypt';
import { validate } from 'src/middleware/validation';
import { deleteCharacterSchema } from 'src/schemas/DeleteCharacter';
import prisma from 'src/database/instance';
import apiHandler from 'src/middleware/apiHandler';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = req.session.user;
    if (!user) {
      return res.json({ success: false, message: 'Not authorised.' });
    }

    const { name, password } = req.body;

    const account: any = await prisma.accounts.findFirst({
      where: { id: user.id, password: sha1Encrypt(password) },
      select: { players: { select: { name: true, id: true } } },
    });

    if (!account) {
      return res.json({
        success: false,
        message: "Password doesn't match.",
      });
    }

    const character = account.players.find((p: any) => p.name === name);
    if (!character) {
      return res.json({
        success: false,
        message: "Couldn't find character.",
      });
    }

    const result = await prisma.players.delete({
      where: {
        id: character.id,
      },
    });

    if (result) {
      res.json({ success: true, message: 'Succesfully deleted character.' });
    } else {
      res.json({ success: false, message: "Couldn't delete character" });
    }
  }
);

export default apiHandler({
  post: validate(deleteCharacterSchema, post),
});
