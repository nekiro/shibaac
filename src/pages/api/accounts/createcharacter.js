import { withSessionRoute } from 'src/util/session';
import { PlayerEntity } from 'src/database';

export default withSessionRoute(async (req, res) => {
  const { user } = req.session;
  if (!user) {
    return res.status(403).json({ message: 'user not found' });
  }

  const { name, vocation, sex } = req.body;

  // TODO: add checks

  const count = await PlayerEntity.count({
    where: { name },
  });

  if (count !== 0) {
    return res.json({
      success: false,
      message: 'Character with that name already exists',
    });
  }

  const character = await PlayerEntity.create({
    name,
    account_id: user.id,
    vocation,
    sex,
  });

  if (character) {
    res.json({ success: true, message: 'Succesfully created character.' });
  } else {
    res.json({ success: true, message: "Couldn't create character." });
  }
});
