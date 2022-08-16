import { withSessionRoute } from '../../../util/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { sha1Encrypt } from '../../../util/crypt';
import { validate } from '../../../middleware/validation';
import { deleteCharacterSchema } from '../../../schemas/DeleteCharacter';
import apiHandler from '../../../middleware/apiHandler';
import * as playerService from '../../../services/playerService';
import * as accountService from '../../../services/accountService';
import { player } from '@prisma/client';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = req.session.user;
    if (!user) {
      return res.json({ success: false, message: 'Not authorised.' });
    }

    const { name, password } = req.body;

    const account: any = await accountService.getAccountBy(
      {
        id: user.id,
        password: sha1Encrypt(password),
      },
      { players: { select: { name: true, id: true } } }
    );

    if (!account) {
      return res.json({
        success: false,
        message: "Password doesn't match.",
      });
    }

    const character = account.players.find((p: player) => p.name === name);
    if (!character) {
      return res.json({
        success: false,
        message: "Couldn't find character.",
      });
    }

    const result = await playerService.deletePlayer(character.id);
    if (result) {
      res.json({
        success: true,
        args: { player: result },
        message: 'Succesfully deleted character.',
      });
    } else {
      res.json({ success: false, message: "Couldn't delete character" });
    }
  }
);

export default apiHandler({
  post: validate(deleteCharacterSchema, post),
});
