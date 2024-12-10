import { z } from "zod";
import { procedure, authProcedure, router } from "../trpc";
import prisma from "../../prisma";
import { sha1Encrypt } from "@lib/crypt";
import { TRPCError } from "@trpc/server";
import { accountWithPlayers } from "@shared/types/PrismaAccount";
import { verifyCaptcha } from "@lib/captcha";

//TODO: accept query parameters to pull only required data
//TODO: guard some these endpoints with authentication

export const accountRouter = router({
	create: procedure
		.input(
			z.object({
				name: z.string(),
				password: z.string(),
				email: z.string().email(),
			}),
		)
		.mutation(async ({ input }) => {
			const { name, password, email } = input;
			let account = await prisma.accounts.findFirst({
				where: {
					name,
				},
			});

			if (account) {
				throw new Error("Account with that name already exists.");
			}

			const timestampInSeconds = Math.floor(Date.now() / 1000);

			account = await prisma.accounts.create({
				data: {
					name,
					password: await sha1Encrypt(password),
					email,
					twoFAEnabled: false,
					creation: timestampInSeconds,
				},
			});

			if (!account) {
				throw new Error("Error occured while creating account");
			}

			return account;
		}),
	login: procedure
		.input(z.object({ name: z.string(), password: z.string(), captchaToken: z.string(), twoFAToken: z.string().optional() }))
		.mutation(async ({ input, ctx }) => {
			const { name, password, captchaToken } = input;
			const { session, req } = ctx;

			try {
				await verifyCaptcha(captchaToken);
			} catch (e) {
				throw new TRPCError({ code: "BAD_REQUEST", message: "Captcha verification failed." });
			}

			const account = await prisma.accounts.findFirst({
				...accountWithPlayers,
				where: {
					name,
					password: await sha1Encrypt(password),
				},
			});

			if (!account) {
				throw new TRPCError({ code: "BAD_REQUEST", message: "Wrong credentials." });
			}

			session.account = account;
			await req.session.save();

			return account;
		}),
	singleById: authProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
		if (ctx.session.account?.id !== input.id) {
			throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden" });
		}

		const account = await prisma.accounts.findFirst({
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
			where: {
				id: input.id,
			},
		});

		return account;
	}),
	logout: authProcedure.mutation(async ({ ctx }) => {
		ctx.session.destroy();
	}),
	deleteCharacter: authProcedure.input(z.object({ name: z.string(), password: z.string() })).mutation(async ({ input, ctx }) => {
		const { name, password } = input;
		const { session } = ctx;

		const account = await prisma.accounts.findFirst({
			where: {
				id: session.account!.id,
				password: await sha1Encrypt(password),
			},
			include: {
				players: { select: { name: true, id: true } },
			},
		});

		if (!account) {
			throw new TRPCError({ code: "BAD_REQUEST", message: "Password doesn't match." });
		}

		const character = account.players.find((p) => p.name === name);
		if (!character) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Couldn't find character." });
		}

		await prisma.players.delete({
			where: {
				id: character.id,
			},
		});

		return character;
	}),
	createCharacter: authProcedure
		.input(
			z.object({
				name: z.string(),
				vocation: z.number(),
				sex: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { name, vocation, sex } = input;

			let player = await prisma.players.findFirst({
				where: { name },
			});
			if (player) {
				throw new TRPCError({ code: "CONFLICT", message: "Character with such name exists." });
			}

			player = await prisma.players.create({
				data: {
					name,
					account_id: ctx.session.account!.id,
					vocation,
					sex,
				},
			});

			return player;
		}),
	changePassword: authProcedure
		.input(
			z.object({
				newPassword: z.string(),
				password: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { newPassword, password } = input;
			const { session } = ctx;

			const account = await prisma.accounts.findFirst({
				where: {
					id: session.account!.id,
					password: await sha1Encrypt(password),
				},
			});

			if (!account) {
				throw new TRPCError({ code: "BAD_REQUEST", message: "Password doesn't match." });
			}

			await prisma.accounts.update({
				where: {
					id: account.id,
				},
				data: {
					password: await sha1Encrypt(newPassword),
				},
			});
		}),
	changeEmail: authProcedure
		.input(
			z.object({
				newEmail: z.string().email(),
				password: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { newEmail, password } = input;
			const { session } = ctx;

			const account = await prisma.accounts.findFirst({
				where: {
					id: session.account!.id,
					password: await sha1Encrypt(password),
				},
			});

			if (!account) {
				throw new TRPCError({ code: "BAD_REQUEST", message: "Password doesn't match." });
			}

			await prisma.accounts.update({
				where: {
					id: account.id,
				},
				data: {
					email: newEmail,
				},
			});
		}),
});
