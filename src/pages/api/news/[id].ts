import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { uploadEditorImages } from '../../../middleware/multer';
import { withSessionRoute } from '../../../lib/session';
import prisma from '../../../prisma';

export const config = { api: { bodyParser: false } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'ID not provided' });
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
          .json({ success: false, message: 'News not found' });
      }

      res.status(200).json({ success: true, args: { data: news } });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
    return;
  }

  if (req.method === 'PUT') {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'ID not provided' });
    }

    uploadEditorImages(req as any, res as any, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
      }

      const imageUrls = files.map(
        (file: any) => `/tmp/uploads/news/${file.filename}`,
      );

      const { title, content } = req.body;

      try {
        const updatedNews = await prisma.aac_news.update({
          where: {
            id: Number(id),
          },
          data: {
            title,
            content,
            imageUrl: JSON.stringify(imageUrls),
          },
        });

        return res
          .status(200)
          .json({ success: true, args: { data: updatedNews } });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: 'Internal server error' });
      } finally {
        await prisma.$disconnect();
      }
    });
  } else {
    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' });
  }
};

export default handler;
