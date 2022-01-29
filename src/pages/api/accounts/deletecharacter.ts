import { withSessionRoute } from 'src/util/session';
import { PlayerEntity, AccountEntity } from 'src/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { sha1Encrypt } from 'src/util/crypt';
import { validate } from 'src/middleware/validation';
import { deleteCharacterSchema } from 'src/schemas/DeleteCharacter';

const handler = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = req.session.user;
    if (!user) {
      return res.json({ success: false, message: 'Not authorised.' });
    }

    const { name, password } = req.body;

    const account: any = await AccountEntity.findByPk(user.id, {
      attributes: ['password'],
      include: { model: PlayerEntity, attributes: ['name'] },
    });

    if (!account) {
      return res.json({
        success: false,
        message: "Couldn't delete character.",
      });
    }

    if (account.dataValues.password !== sha1Encrypt(password)) {
      return res.json({ success: false, message: 'Password do not match.' });
    }

    const char = account.players.find(
      (player: any) => player.dataValues.name === name
    );

    if (!char) {
      return res.json({
        success: false,
        message: "Couldn't delete character.",
      });
    }

    const result = await PlayerEntity.destroy({
      where: {
        name,
      },
    });

    if (result) {
      res.json({ success: true, message: 'Succesfully deleted character.' });
    } else {
      res.json({ success: false, message: "Couldn't delete character" });
    }
  }
);

export default validate(deleteCharacterSchema, handler);
