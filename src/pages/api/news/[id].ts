import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID not provided' });
    }

    try {
      const news = await prisma.aac_news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!news) {
        return res
          .status(404)
          .json({ success: false, error: 'News not found' });
      }

      res.status(200).json({ success: true, args: { data: news } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
    return;
  }

  if (req.method === 'PUT') {
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID not provided' });
    }

    const { title, content, imageUrl } = req.body;

    try {
      const updatedNews = await prisma.aac_news.update({
        where: {
          id: Number(id),
        },
        data: {
          title,
          content,
          imageUrl,
        },
      });

      return res
        .status(200)
        .json({ success: true, args: { data: updatedNews } });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: 'Method not allowed' });
  }
};

export default handler;
