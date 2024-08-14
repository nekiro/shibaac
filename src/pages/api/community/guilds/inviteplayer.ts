import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { guildId } = req.query;
    try {
      const invites = await prisma.guild_invites.findMany({
        where: {
          guild_id: Number(guildId),
        },
        include: {
          players: {
            select: {
              name: true,
              level: true,
              vocation: true,
            },
          },
        },
      });

      res.status(200).json({ success: true, args: { data: invites } });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }

  if (req.method === 'POST') {
    try {
      const { player_invite, guild_id } = req.body;

      const getPlayerToInvite = await prisma.players.findFirst({
        where: {
          name: player_invite,
        },
      });

      if (!getPlayerToInvite) {
        return res.json({ success: false, message: 'Player not found' });
      }

      const existingInvite = await prisma.guild_invites.findFirst({
        where: {
          player_id: getPlayerToInvite.id,
          guild_id: Number(guild_id),
        },
      });

      if (existingInvite) {
        return res.json({
          success: false,
          message: 'Player is already invited to the guild',
        });
      }

      const newInvite = await prisma.guild_invites.create({
        data: {
          player_id: Number(getPlayerToInvite.id),
          guild_id: Number(guild_id),
        },
      });

      res.status(201).json({ success: true, args: { data: newInvite } });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { inviteId, guildId } = req.query;

      if (!inviteId) {
        return res
          .status(400)
          .json({ success: false, message: 'Invite ID is required' });
      }

      const invite = await prisma.guild_invites.findMany({
        where: { player_id: Number(inviteId), guild_id: Number(guildId) },
      });

      if (!invite) {
        return res
          .status(404)
          .json({ success: false, message: 'Invite not found' });
      }

      await prisma.guild_invites.delete({
        where: {
          player_id_guild_id: {
            player_id: Number(inviteId),
            guild_id: Number(guildId),
          },
        },
      });

      res
        .status(200)
        .json({ success: true, message: 'Invite deleted successfully' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }
};

export default handler;
