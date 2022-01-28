import { AccountEntity } from 'src/database';
import { sha1Encrypt } from '../../../util/crypt';

export default async function handler(req, res) {
  if (req.method == 'POST') {
    const { name, password, email } = req.body;

    const count = await AccountEntity.count({
      where: { name: req.body.name },
    });

    if (count !== 0) {
      return res.json({ success: false, message: 'Account already exists' });
    }

    const account = await AccountEntity.create({
      name,
      password: sha1Encrypt(password),
      email,
    });

    if (!account) {
      return res.json({
        success: false,
        message: 'Error occured while creating account',
      });
    }

    res.json({ success: true, message: 'Account created successfuly' });
  }
}
