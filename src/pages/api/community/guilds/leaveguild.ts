import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { guildId, memberId } = req.query;

      const member = await prisma.guild_membership.findUnique({
        where: {
          player_id_guild_id: {
            guild_id: Number(guildId),
            player_id: Number(memberId),
          },
        },
      });

      if (!member) {
        return res
          .status(404)
          .json({ success: false, message: 'Member not found in the guild' });
      }

      await prisma.guild_membership.delete({
        where: {
          player_id_guild_id: {
            guild_id: Number(guildId),
            player_id: Number(memberId),
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Member successfully left the guild',
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};

export default handler;
