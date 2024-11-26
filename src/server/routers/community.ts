import { z } from "zod";
import { procedure, router } from "../trpc";
import prisma from "../../prisma";
import { Vocation } from "src/shared/enums/Vocation";
import { Skill } from "src/shared/enums/Skill";

export const communityRouter = router({
	highscores: procedure
		.input(
			z.object({
				vocation: z.nativeEnum(Vocation).or(z.literal("all")),
				skill: z.nativeEnum(Skill),
				limit: z.number().min(1).max(100).optional().default(50),
				cursor: z.number().optional(),
			}),
		)
		.query(async ({ input }) => {
			const { vocation, skill, limit, cursor } = input;

			const players = await prisma.players.findMany({
				take: limit + 1,
				where: {
					vocation: vocation === "all" ? undefined : vocation,
					[skill]: { gte: 0 },
				},
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: { level: "desc" },
			});

			let nextCursor: typeof cursor | undefined = undefined;
			if (players.length > limit) {
				const nextItem = players.pop();
				nextCursor = nextItem!.id;
			}

			return {
				players,
				nextCursor,
			};
		}),
});
