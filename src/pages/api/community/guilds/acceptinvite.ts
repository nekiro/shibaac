import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { inviteId, player_name } = req.query;

      const invite = await prisma.guild_invites.findUnique({
        where: { player_id: Number(inviteId) },
      });

      if (!invite) {
        return res
          .status(404)
          .json({ success: false, message: 'Invite not found' });
      }

      await prisma.guild_membership.create({
        data: {
          player_id: invite.player_id,
          guild_id: invite.guild_id,
          nick: String(player_name),
          rank_id: 3,
        },
      });

      await prisma.guild_invites.delete({
        where: { player_id: Number(inviteId) },
      });

      res.status(200).json({
        success: true,
        message: 'Invite accepted and player added to the guild',
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
