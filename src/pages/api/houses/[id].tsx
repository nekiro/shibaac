import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../lib/session";

const prisma = new PrismaClient();

const getHouse = withSessionRoute(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const id = parseInt(req.query.id, 10);

			const house = await prisma.houses.findUnique({
				where: { id },
			});
			res.status(200).json(house);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
);

const postBid = withSessionRoute(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const { bid, houseId, characterId } = req.body;

			if (!bid || !houseId || !characterId || bid <= 0) {
				throw new Error("Dados de entrada inválidos");
			}

			const house = await prisma.houses.findUnique({ where: { id: houseId } });

			if (!house) {
				throw new Error("Casa não encontrada");
			}

			if (bid <= house.bid) {
				throw new Error("O bid deve ser maior que o bid atual");
			}

			const updatedHouse = await prisma.houses.update({
				where: { id: houseId },
				data: {
					bid,
					highest_bidder: characterId,
					last_bid: Math.floor(new Date().getTime() / 1000),
					bid_end: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60, // 24 horas em segundos
				},
			});

			res.status(200).json({
				message: "Bid criado com sucesso",
				success: true,
				args: { data: updatedHouse },
			});
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}
);

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "GET":
			return getHouse(req, res);
		case "POST":
			return postBid(req, res);
		default:
			return res.status(405).json({ message: "Method not allowed" });
	}
};

export default handleRequest;
