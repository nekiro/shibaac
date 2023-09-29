import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../../middleware/apiHandler';
import prisma from '../../../../prisma';
import { withSessionRoute } from '../../../../lib/session';

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
    const { playerId, initial_bid, end_date, oldAccountId } = req.body;

    const player = await prisma.players.findFirst({
      where: {
        id: Number(playerId),
      },
    });

    if (!player) {
      return res.status(500).json({
        success: false,
        message:
          'Player not found or does not belong to the specified account.',
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

    const auctionHouseAccount = await prisma.accounts.findUnique({
      where: { name: 'AuctionBazar' },
    });

    if (!auctionHouseAccount) {
      return res.status(500).json({
        success: false,
        message: 'There was a problem transferring to our bazaar system',
      });
    }

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
        oldAccountId: oldAccountId,
      },
    });

    if (auctionHouseAccount) {
      await prisma.players.update({
        where: {
          id: Number(playerId),
        },
        data: {
          account_id: auctionHouseAccount.id,
        },
      });
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'Internal server error' });
    }

    return res.status(201).json({ success: true, args: { data: newListing } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

const get = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = req.session.user;

    if (!user) {
      return res.status(403).json({ message: 'Unauthorised.' });
    }

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

      const modifiedListings = bazarListings.map((listing) => {
        const isOwner = listing.oldAccountId === user.id;
        const { oldAccountId, ...remainingProps } = listing;

        return {
          ...remainingProps,
          isOwner: isOwner,
        };
      });

      return res
        .status(200)
        .json({ success: true, args: { data: modifiedListings } });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  },
);

export default apiHandler({
  post,
  get,
});
