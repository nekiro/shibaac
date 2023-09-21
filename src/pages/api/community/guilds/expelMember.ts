import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { guildId, playerId, leaderId } = req.query;

      const leaderData = await prisma.guild_membership.findMany({
        where: {
          player_id: Number(leaderId),
          guild_id: Number(guildId),
        },
      });

      if (
        !leaderData ||
        (leaderData[0].rank_id !== 1 && leaderData[0].rank_id !== 2)
      ) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to expel members',
        });
      }

      const memberData = await prisma.guild_membership.findMany({
        where: {
          player_id: Number(playerId),
          guild_id: Number(guildId),
        },
      });

      if (!memberData) {
        return res
          .status(404)
          .json({ success: false, message: 'Member not found' });
      }

      if (memberData[0].guild_id !== leaderData[0].guild_id) {
        return res
          .status(403)
          .json({ success: false, message: 'Member is not in your guild' });
      }

      await prisma.guild_membership.delete({
        where: {
          player_id_guild_id: {
            guild_id: Number(guildId),
            player_id: Number(playerId),
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Member expelled successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};

export default handler;
