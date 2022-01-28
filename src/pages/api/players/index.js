export default function handler(req, res) {
  if (req.method == 'GET') {
    res.status(200).json([
      { name: 'Nekir', vocation: 'Knight', level: 2 },
      { name: 'Sxxx', vocation: 'Sorcerer', level: 15 },
    ]);
  }
}
