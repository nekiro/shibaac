import {
  PlayerEntity,
  AccountEntity,
  PlayersOnlineEntity,
  PlayerDeathsEntity,
} from 'src/database';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const { name } = req.query;

    const player = await PlayerEntity.findOne({
      where: {
        name: name,
      },
      include: [
        { model: AccountEntity, include: PlayerEntity },
        PlayersOnlineEntity,
        PlayerDeathsEntity,
      ],
    });

    if (!player) {
      return res.status(200).json({ success: false, message: 'Not found.' });
    }

    res.status(200).json({ success: true, args: { player } });
  }
}
