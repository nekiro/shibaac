import { z } from "zod";
import { procedure, router } from "../trpc";
import prisma from "../../prisma";

export const newsRouter = router({
	all: procedure.query(async () => {
		const news = await prisma.aac_news.findMany();
		return news;
	}),
	single: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
		const news = await prisma.aac_news.findUnique({
			where: {
				id: input.id,
			},
		});

		return news;
	}),
	create: procedure
		.input(
			z.object({
				title: z.string(),
				content: z.string(),
				playerNick: z.string(),
				imageUrl: z.string(),
				authorId: z.number().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const newNews = await prisma.aac_news.create({
				data: {
					title: input.title,
					content: input.content,
					playerNick: input.playerNick,
					imageUrl: input.imageUrl,
					authorId: input.authorId,
				},
			});

			return newNews;
		}),
	patch: procedure
		.input(z.object({ id: z.number(), title: z.string().optional(), content: z.string().optional(), imageUrl: z.string().optional() }))
		.mutation(async ({ input }) => {
			const updatedNews = await prisma.aac_news.update({
				where: {
					id: input.id,
				},
				data: {
					title: input.title,
					content: input.content,
					imageUrl: input.imageUrl,
				},
			});

			return updatedNews;
		}),
	overwrite: procedure
		.input(z.object({ id: z.number(), title: z.string(), content: z.string(), imageUrl: z.string(), authorId: z.number(), playerNick: z.string() }))
		.mutation(async ({ input }) => {
			const updatedNews = await prisma.aac_news.update({
				where: {
					id: input.id,
				},
				data: {
					title: input.title,
					content: input.content,
					imageUrl: input.imageUrl,
					authorId: input.authorId,
					playerNick: input.playerNick,
				},
			});

			return updatedNews;
		}),
	delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
		const deletedNews = await prisma.aac_news.delete({
			where: {
				id: input.id,
			},
		});

		return deletedNews;
	}),
});
