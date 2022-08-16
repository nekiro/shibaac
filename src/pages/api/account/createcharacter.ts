import { withSessionRoute } from '../../../util/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { validate } from '../../../middleware/validation';
import { createCharacterSchema } from '../../../schemas/CreateCharacter';
import apiHandler from '../../../middleware/apiHandler';
import * as playerService from '../../../services/playerService';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = req.session.user;
    if (!user) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const {
      name,
      vocation,
      sex,
    }: { name: string; vocation: string; sex: string } = req.body;

    let player = await playerService.findPlayerByName(name);
    if (player) {
      return res.json({
        success: false,
        message: 'Character with that name already exists',
      });
    }

    player = await playerService.createPlayer(name, user.id, +vocation, +sex);
    if (player) {
      res.json({
        success: true,
        args: { player },
        message: 'Succesfully created character.',
      });
    } else {
      res.json({ success: false, message: "Couldn't create character." });
    }
  }
);

export default apiHandler({
  post: validate(createCharacterSchema, post),
});
