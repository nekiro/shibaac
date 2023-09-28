import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";
import apiHandler from "../../../middleware/apiHandler";

export const get = async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const {
			vocation = "all",
			category = "Experience",
			page = "1",
			per_page = "900",
		} = req.query;

		let filterVocation = vocation === "all" ? "all" : Number(vocation);
		let highscoresPlayer;

		let pagination = {
			page: Number(page),
			per_page: Number(per_page),
			offset: 0,
			limit: Number(per_page),
		};

		pagination.offset = (pagination.page - 1) * pagination.per_page;

		const order = [{ level: "desc" }, { name: "asc" }];

		let categoryFilter = {};
		if (category !== "Experience") {
			if (typeof category === "string") {
				categoryFilter = { [category]: { gte: 0 } };
			} else {
				return res.status(400).json({ error: "Invalid category value" });
			}
		}

		if (filterVocation === "all") {
			highscoresPlayer = await prisma.players.findMany({
				skip: pagination.offset,
				take: pagination.limit,
				orderBy: order,
				where: {
					...categoryFilter,
				},
			});
		} else if (!isNaN(filterVocation)) {
			highscoresPlayer = await prisma.players.findMany({
				skip: pagination.offset,
				take: pagination.limit,
				orderBy: order,
				where: {
					vocation: filterVocation,
					...categoryFilter,
				},
			});
		} else {
			return res.status(400).json({ error: "Invalid vocation value" });
		}

		highscoresPlayer = highscoresPlayer.map((player: any) => {
			const newPlayer = { ...player };
			for (const [key, value] of Object.entries(newPlayer)) {
				if (typeof value === "bigint") {
					newPlayer[key] = value.toString();
				}
			}
			return newPlayer;
		});

		return res
			.status(200)
			.json({ success: true, args: { data: highscoresPlayer } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, error: "Internal server error" });
	} finally {
		await prisma.$disconnect();
	}
};
export default apiHandler({
	get: get,
});
