import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../../middleware/apiHandler';
import prisma from '../../../../prisma';

import { differenceInMinutes, differenceInHours, parseISO } from 'date-fns';

const transformPlayerItemsToEquipedItems = (playerItems: any[]) => {
  const arrItems = {
    slotHead: null,
    slotArmor: null,
    slotRight: null,
    slotLeft: null,
    slotLegs: null,
    slotFeet: null,
  };

  playerItems.forEach((item) => {
    switch (item.pid) {
      case 1:
        arrItems.slotHead = item.itemtype;
        break;
      case 4:
        arrItems.slotArmor = item.itemtype;
        break;
      case 5:
        arrItems.slotRight = item.itemtype;
        break;
      case 6:
        arrItems.slotLeft = item.itemtype;
        break;
      case 8:
        arrItems.slotFeet = item.itemtype;
        break;
    }
  });

  return arrItems;
};

const getRemainingTime = (endDateStr: string): string => {
  const now = new Date();
  const endDate = parseISO(endDateStr);
  const diffInHours = differenceInHours(endDate, now);

  if (diffInHours < 1) {
    const diffInMinutes = differenceInMinutes(endDate, now);
    return `${diffInMinutes} minutos restantes`;
  }

  return `${diffInHours} horas restantes`;
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playerId, initial_bid, end_date } = req.body;

    const player = await prisma.players.findFirst({
      where: {
        id: Number(playerId),
      },
    });

    if (!player) {
      return res.status(400).json({
        error: 'Player não encontrado ou não pertence à conta especificada.',
      });
    }

    const playerItems = await prisma.player_items.findMany({
      where: {
        player_id: Number(playerId),
        pid: { in: [1, 4, 5, 6, 8] },
      },
    });

    const equipedItems = transformPlayerItemsToEquipedItems(playerItems);

    const transformPlayerSkills = {
      Magic: player.maglevel || 0,
      Club: player.skill_club || 0,
      Fist: player.skill_fist || 0,
      Sword: player.skill_sword || 0,
      Axe: player.skill_axe || 0,
      Distance: player.skill_dist || 0,
      Shielding: player.skill_shielding || 0,
      Fishing: player.skill_fishing || 0,
    };

    const storagesInRange = await prisma.player_storage.findMany({
      where: {
        player_id: playerId,
        key: {
          gte: 70000,
          lte: 70100,
        },
      },
    });

    const questArray = storagesInRange.map((storage) => storage.key);

    const playerCharms = await prisma.player_charms.findFirst({
      where: {
        player_guid: Number(playerId),
      },
    });

    const charmData = {
      charm_points: playerCharms?.charm_points,
      charm_expansion: playerCharms?.charm_expansion,
      rune_wound: playerCharms?.rune_wound,
    };

    const newListing = await prisma.bazarListings.create({
      data: {
        player: {
          connect: {
            id: player.id,
          },
        },
        name: player.name,
        characterPage: 'auction-' + player.name.toLowerCase(),
        level: player.level,
        vocation: player.vocation,
        highlight: false,
        country: 'BR',
        world: player.town_id,
        pvpType: 'PVP',
        battlEyeStatus: 'disabled',
        remainingTime: getRemainingTime(end_date),
        endingAt: end_date,
        coins: initial_bid,
        skills: transformPlayerSkills,
        equipedItems: equipedItems,
        charms: charmData,
        quests: questArray,
        extras: {},
      },
    });

    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao adicionar listagem ao bazar.',
      details: error.message,
    });
  }
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const bazarListings = await prisma.bazarListings.findMany({
      include: {
        BazarBids: {
          select: {
            id: true,
            bazarListingId: true,
            amount: true,
            bidderPlayerName: true,
            createdAt: true,
          },
          orderBy: {
            amount: 'desc',
          },
        },
      },
    });

    res.status(200).json({ success: true, args: { data: bazarListings } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export default apiHandler({
  post,
  get,
});
