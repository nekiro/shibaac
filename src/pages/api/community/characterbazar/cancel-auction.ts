import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../../middleware/apiHandler';
import prisma from '../../../../prisma';
import { withSessionRoute } from '../../../../lib/session';

const post = withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { auctionId } = req.query;

    const user = req.session.user;

    if (!user) {
      return res.status(403).json({ message: 'Unauthorised.' });
    }

    if (!auctionId) {
      return res
        .status(400)
        .json({ message: 'Invalid input data', success: false });
    }

    try {
      const auction = await prisma.bazarListings.findUnique({
        where: { id: Number(auctionId) },
      });

      if (!auction || auction.oldAccountId !== user.id) {
        return res.status(400).json({
          message: 'Auction not found or not owned by user.',
          success: false,
        });
      }

      await prisma.players.update({
        where: { id: auction.playerId },
        data: { account_id: auction.oldAccountId },
      });

      await prisma.bazarListings.delete({
        where: { id: Number(auctionId) },
      });

      return res.status(200).json({
        message: 'Auction cancelled successfully.',
        success: true,
      });
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
});
