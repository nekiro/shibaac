import { NewsEntity } from 'src/database';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const news = await NewsEntity.findAll();
    res.status(200).json({ success: true, args: { news } });
  }
}
