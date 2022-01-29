import { AccountEntity, PlayerEntity } from 'src/database';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const { id } = req.query;

    //TODO: accept query parameters to pull only required data

    const account = await AccountEntity.findByPk(id, {
      include: { model: PlayerEntity, attributes: ['name', 'level'] },
    });

    if (!account) {
      return res.json({ success: false, message: 'Account not found' });
    }

    res.status(200).json({ success: true, args: { account } });
  }
}
