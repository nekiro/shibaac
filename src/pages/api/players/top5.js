import prisma from 'src/database/instance';

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const players = await prisma.players.findMany({
      orderBy: { level: 'desc' },
      select: { name: true, level: true },
    });

    res.status(200).json({ success: true, args: { players } });
  }
}
