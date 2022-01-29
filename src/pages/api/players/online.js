import { PlayersOnlineEntity, PlayerEntity } from 'src/database';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const players = await PlayersOnlineEntity.findAll({
      attributes: [],
      include: {
        model: PlayerEntity,
        attributes: ['name', 'level', 'vocation'],
      },
    });

    res.status(200).json({ success: true, args: { players } });
  }
}
