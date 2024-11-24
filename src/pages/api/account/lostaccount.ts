import { NextApiRequest, NextApiResponse } from "next";
import { recoverPasswordSchema } from "../../../schemas/RecoveryPassword";
import { sendEmail } from "../../../lib/nodemailer";
import apiHandler from "../../../middleware/apiHandler";
import prisma from "../../../prisma";
import jwt from "jsonwebtoken";

function generateResetToken(accountId: number): string {
	const secretKey = process.env.JWT_SECRET_KEY || "fallback-secret-key";

	const payload = { accountId };

	const options: jwt.SignOptions = {
		expiresIn: "1h",
	};

	const token = jwt.sign(payload, secretKey, options);

	return token;
}

export const post = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { email, characterName, accountName, recoveryKey, type } = req.body;

		await recoverPasswordSchema.validate(req.body);

		let account;

		switch (type) {
			case "1":
				// Recovery type 1: check email, characterName, and accountName
				account = await prisma.accounts.findFirst({
					where: {
						email: email,
						name: accountName,
					},
					include: {
						players: {
							where: { name: characterName },
						},
					},
				});
				break;

			case "2":
				// Recovery type 2: check recoveryKey
				account = await prisma.accounts.findUnique({
					where: { rec_key: recoveryKey },
				});
				break;

			case "3":
				// Recovery type 3: check recoveryKey and (accountName or email)
				account = await prisma.accounts.findFirst({
					where: {
						rec_key: recoveryKey,
						OR: [{ name: accountName }, { email: email }],
					},
				});

				break;

			default:
				return res.status(400).json({ success: false, message: "Invalid recovery type." });
		}

		if (!account) {
			return res.status(400).json({
				success: false,
				message: "No account found with the provided details.",
			});
		}

		const resetToken = generateResetToken(account.id);

		await prisma.accounts.update({
			where: { email },
			data: { resetToken },
		});

		const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
		const subject = "Password Reset Request";
		const text = `You requested a password reset. Click here to reset your password: ${resetLink}`;

		await sendEmail(email, subject, text);

		res.json({
			success: true,
			message: "Password reset email sent successfully.",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error && (error as any)?.errors[0] });
	} finally {
		await prisma.$disconnect();
	}
};

export default apiHandler({
	post: post,
});
