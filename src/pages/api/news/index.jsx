import { NewsEntity } from 'src/database';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    res.status(200).json(await NewsEntity.findAll());
  }
}
