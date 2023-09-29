import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../../middleware/apiHandler';
import prisma from '../../../../prisma';

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { bidderAccountId, bidAmount, bazarListingId, currentBidAmount } =
    req.body;

  if (!bidderAccountId || !bidAmount || !bazarListingId || !currentBidAmount) {
    return res
      .status(400)
      .json({ message: 'Invalid input data', success: false });
  }

  const getAccountBidder = await prisma.accounts.findFirst({
    where: {
      id: bidderAccountId,
      coins: {
        gte: bidAmount,
      },
    },
    include: {
      players: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!getAccountBidder) {
    return res.status(400).json({
      message: 'This account does not have enough coins.',
      success: false,
    });
  }

  if (getAccountBidder.coins < currentBidAmount) {
    return res.status(400).json({
      message: 'The account does not have enough coins to cover the bid.',
      success: false,
    });
  }

  if (bidAmount === currentBidAmount) {
    return res.status(400).json({
      message:
        'You cannot bid the same as the previous one, the value needs to be higher.',
      success: false,
    });
  }

  try {
    const newBid = await prisma.bazarBids.create({
      data: {
        bidderAccountId,
        amount: bidAmount,
        bazarListingId,
        bidderPlayerName:
          getAccountBidder.players.length > 0
            ? getAccountBidder.players[0].name
            : null,
      },
    });

    return res.status(200).json({
      message: 'Bid placed successfully',
      success: true,
      args: { data: newBid },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export default apiHandler({
  post,
});
