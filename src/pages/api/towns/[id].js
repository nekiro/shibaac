import { TownEntity } from 'src/database';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const { id } = req.query;

    const town = await TownEntity.findByPk(id);
    if (!town) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json(town);
  }
}
