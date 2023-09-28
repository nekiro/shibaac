import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

cron.schedule("*/1 * * * *", async () => {
	try {
		console.log("Checking for expired bids...");

		const expiredHouses = await prisma.houses.findMany({
			where: {
				bid_end: {
					lt: Math.floor(new Date().getTime() / 1000),
				},
				highest_bidder: {
					gt: 0,
				},
			},
		});

		for (const house of expiredHouses) {
			await prisma.houses.update({
				where: { id: house.id },
				data: {
					owner: house.highest_bidder,
					highest_bidder: 0,
					bid: 0,
					bid_end: 0,
				},
			});
		}

		console.log("Expired bids checked.");
	} catch (error) {
		console.error("Failed to check expired bids:", error);
	}
});
