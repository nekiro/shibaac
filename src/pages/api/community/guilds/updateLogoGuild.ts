import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { uploadGuildLogo } from "../../../../middleware/multer";
import { withSessionRoute } from "../../../../lib/session";
import prisma from "../../../../prisma";

export const config = { api: { bodyParser: false } };

const patch = withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
	const { guildId } = req.query;

	uploadGuildLogo(req as any, res as any, async (err) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		const file = (req as any).file;
		if (!file) {
			return res.status(400).json({ error: "Nenhum arquivo foi enviado." });
		}

		try {
			const guild = await prisma.guilds.findUnique({
				where: { id: Number(guildId) },
				select: { logoUrl: true },
			});

			if (guild?.logoUrl) {
				const currentLogoPath = path.join("public", guild.logoUrl);

				if (fs.existsSync(currentLogoPath)) {
					fs.unlinkSync(currentLogoPath);
				}
			}
		} catch (error) {
			console.error("Erro ao buscar ou deletar o logo atual:", error);
		}

		const newFilePath = path.join("public", "tmp", "uploads", "guilds", file.filename);

		fs.rename(file.path, newFilePath, async (err) => {
			if (err) {
				console.error("Error moving file:", err);
				return res.status(500).json({ error: "Não foi possível mover o arquivo." });
			}

			const logoUrl = `/tmp/uploads/guilds/${file.filename}`;

			try {
				await prisma.guilds.update({
					where: { id: Number(guildId) },
					data: { logoUrl },
				});

				return res.status(200).json({ success: true, data: logoUrl });
			} catch (error) {
				console.error(error);
				return res.status(500).json({ success: false, error: "Internal server error" });
			} finally {
				await prisma.$disconnect();
			}
		});
	});
});

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "PATCH":
			return patch(req, res);
		default:
			return res.status(405).json({ message: "Method not allowed" });
	}
};

export default handleRequest;
