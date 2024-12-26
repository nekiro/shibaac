import { z } from "zod";
import { procedure, router } from "../trpc";
import prisma from "../../prisma";
import { TRPCError } from "@trpc/server";

export const playerRouter = router({
	singleByName: procedure.input(z.object({ name: z.string() })).query(async ({ input }) => {
		const player = await prisma.players.findFirst({
			where: { name: input.name },
			select: {
				accounts: {
					select: {
						premium_ends_at: true,
						players: { select: { name: true, level: true, vocation: true } },
					},
				},
				player_deaths: true,
				name: true,
				sex: true,
				vocation: true,
				level: true,
				lastlogin: true,
				group_id: true,
				town_id: true,
				guilds: {
					select: { name: true },
				},
			},
		});

		if (!player) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Character not found" });
		}

		const town = await prisma.towns.findFirst({
			where: { id: player.town_id },
			select: { name: true },
		});

		return {
			player,
			town,
		};
	}),
	online: procedure.query(async () => {
		const players = await prisma.players_online.findMany({
			include: { players: { select: { name: true, vocation: true, level: true } } },
		});

		return players.map((player) => player.players);
	}),
	top5: procedure.query(async () => {
		const players = await prisma.players.findMany({
			orderBy: { level: "desc" },
			select: { name: true, level: true },
			take: 5,
		});

		return players;
	}),
});
