import { Prisma } from "@prisma/client";

export const accountWithPlayers = Prisma.validator<Prisma.accountsDefaultArgs>()({
	select: {
		id: true,
		name: true,
		email: true,
		type: true,
		coins: true,
		premium_ends_at: true,
		creation: true,
		players: { select: { id: true, name: true, level: true, vocation: true } },
	},
});

export type AccountWithPlayers = Prisma.accountsGetPayload<typeof accountWithPlayers>;
