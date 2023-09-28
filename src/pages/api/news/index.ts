import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method == "GET") {
		const news = await prisma.aac_news.findMany();
		res.status(200).json({ success: true, args: { data: news } });
		return;
	}

	if (req.method === "POST") {
		const { title, content, playerNick, imageUrl, authorId } = req.body;

		if (!title || !content || !playerNick || !authorId) {
			return res
				.status(400)
				.json({ success: false, error: "Missing required fields" });
		}

		try {
			const newNews = await prisma.aac_news.create({
				data: {
					title,
					content,
					playerNick,
					imageUrl,
					authorId,
				},
			});
			return res.status(201).json({ success: true, data: { news: newNews } });
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ success: false, error: "Internal server error" });
		} finally {
			await prisma.$disconnect();
		}
	} else {
		res.status(405).json({ success: false, error: "Method not allowed" });
		return;
	}
};

export default handler;
