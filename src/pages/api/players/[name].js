import { PlayerEntity, AccountEntity, PlayersOnlineEntity } from 'src/database';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const { name } = req.query;

    const player = await PlayerEntity.findOne({
      where: {
        name: name,
      },
      include: {
        model: AccountEntity,
        include: {
          model: PlayerEntity,
          include: PlayersOnlineEntity,
        },
      },
      // attributes: ['name'],
    });

    //console.log(JSON.stringify(player, null, 2));

    //await new Promise((resolve) => setTimeout(resolve, 2000));

    if (!player) {
      return res.status(404).json({ message: 'Not found.' });
    }

    res.status(200).json(player);
  }
}
