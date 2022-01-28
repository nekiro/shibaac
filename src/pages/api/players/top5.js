import { PlayerEntity } from 'src/database';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const players = await PlayerEntity.findAll({
      order: [['level', 'desc']],
      attributes: ['name', 'level'],
    });

    res.status(200).json(players);
  }
}
