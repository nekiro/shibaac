import { z } from "zod";
import { procedure, router } from "../trpc";
import prisma from "../../prisma";

export const townRouter = router({
	singleById: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
		const town = await prisma.towns.findFirst({
			where: { id: input.id },
		});

		return town;
	}),
});
