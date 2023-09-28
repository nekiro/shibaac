import { withSessionRoute } from "../../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { sha1Encrypt } from "../../../lib/crypt";
import { validate } from "../../../middleware/validation";
import { deleteCharacterSchema } from "../../../schemas/DeleteCharacter";
import apiHandler from "../../../middleware/apiHandler";
import * as playerService from "../../../services/playerService";
import * as accountService from "../../../services/accountService";
import { players } from "@prisma/client";

const post = withSessionRoute(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const user = req.session.user;
		if (!user) {
			return res.status(403).json({ success: false, message: "Unauthorized." });
		}

		const { name, password } = req.body;

		const account: any = await accountService.getAccountBy(
			{
				id: user.id,
				password: await sha1Encrypt(password),
			},
			{ players: { select: { name: true, id: true } } }
		);

		if (!account) {
			return res.status(400).json({
				success: false,
				message: "Password doesn't match.",
			});
		}

		const character = account.players.find((p: players) => p.name === name);
		if (!character) {
			return res.status(404).json({
				success: false,
				message: "Couldn't find character.",
			});
		}

		const result = await playerService.deletePlayer(character.id);
		if (result) {
			res.json({
				success: true,
				args: { player: result },
				message: "Succesfully deleted character.",
			});
		} else {
			res
				.status(500)
				.json({ success: false, message: "Couldn't delete character" });
		}
	}
);

export default apiHandler({
	post: validate(deleteCharacterSchema, post),
});
