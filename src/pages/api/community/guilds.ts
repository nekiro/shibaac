import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/database/instance';
import { bigIntsToStrings } from 'src/util';

type GuildSerialized = {
  [key: string]: any;
  memberCount: number;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const guilds = await prisma.guilds.findMany();

      const memberCounts = await prisma.guild_membership.groupBy({
        by: ['guild_id'],
        _count: {
          guild_id: true,
        },
      });

      const memberCountMap: Record<string, number> = {};
      memberCounts.forEach((item) => {
        memberCountMap[item.guild_id] = item._count.guild_id;
      });

      const serializedGuilds: GuildSerialized[] = guilds.map((guild) => ({
        ...bigIntsToStrings(guild),
        memberCount: memberCountMap[guild.id] || 0,
      }));

      res.status(200).json({ success: true, data: serializedGuilds });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }

  if (req.method == 'POST') {
    const { leader_id, leader_name, guild_name } = req.body;

    if (!leader_id || !leader_name || !guild_name) {
      return res.status(400).json({
        success: false,
        error: 'Leader ID and guild name are required',
      });
    }

    try {
      const newGuild = await prisma.guilds.create({
        data: {
          name: guild_name,
          creationdata: new Date(),
          ownerid: leader_id,
        },
      });

      const addRanks = [
        { name: 'the Leader', level: 3, guild_id: newGuild.id },
        { name: 'a Vice-Leader', level: 2, guild_id: newGuild.id },
        { name: 'a Member', level: 1, guild_id: newGuild.id },
      ];

      for (let i = 0; i < addRanks.length; i++) {
        await prisma.guild_ranks.create({ data: addRanks[i] });
      }

      await prisma.guild_membership.create({
        data: {
          player_id: leader_id,
          guild_id: newGuild.id,
          nick: leader_name,
          rank_id: 1,
        },
      });

      res.status(200).json({ success: true, data: newGuild });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }
};

export default handler;
