import { z } from "zod";
import { procedure, router } from "../trpc";
import prisma from "../../prisma";
import { sha1Encrypt } from "@lib/crypt";

//TODO: accept query parameters to pull only required data
//TODO: guard some these endpoints with authentication

export const accountRouter = router({
	singleById: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
		const account = await prisma.accounts.findFirst({
			where: {
				id: input.id,
			},
			include: {
				players: { select: { id: true, name: true, level: true, vocation: true } },
			},
		});

		return account;
	}),
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
	login: procedure.input(z.object({ name: z.string(), password: z.string(), twoFAToken: z.string().optional() })).mutation(async ({ input, ctx }) => {
		const { name, password, twoFAToken } = input;
		const { session, req } = ctx;

		const account = await prisma.accounts.findFirst({
			where: {
				name,
				password: await sha1Encrypt(password),
			},
		});

		if (!account) {
			throw new Error("Wrong credentials.");
		}

		// if (account.twoFAEnabled) {
		// 	const verified = speakeasy.totp.verify({
		// 		secret: String(account.twoFASecret),
		// 		encoding: "base32",
		// 		token: twoFAToken,
		// 		window: 2,
		// 	});

		// 	if (!verified) {
		// 		return { success: false, message: "Wrong 2FA token." };
		// 	}
		// }

		session.user = account;
		await req.session.save();

		return account;
	}),
});
