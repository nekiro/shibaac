import { withSessionRoute } from "../../../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const post = withSessionRoute(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const { isTwoFA } = req.body;
			const user = req.session.user;
			if (!user) {
				return res.status(403).json({ message: "Not authorized." });
			}

			let secret;
			let dataURL;
			if (isTwoFA) {
				secret = speakeasy.generateSecret({
					length: 20,
					name: "shibaAC",
					issuer: "shibaAC",
				});
				dataURL = await QRCode.toDataURL(secret.otpauth_url);
			} else {
				secret = null;
			}

			await prisma.accounts.update({
				where: { id: user.id },
				data: {
					twoFASecret: isTwoFA ? secret.base32 : null,
					twoFAEnabled: isTwoFA,
				},
			});

			return res.json({ success: true, args: { dataURL } });
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ success: false, error: "Internal server error" });
		} finally {
			await prisma.$disconnect();
		}
	}
);

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "POST":
			return post(req, res);
		default:
			return res.status(405).json({ message: "Method not allowed" });
	}
};

export default handleRequest;
