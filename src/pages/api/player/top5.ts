import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "../../../middleware/apiHandler";
import { getPlayers } from "../../../services/playerService";

const get = async (_: NextApiRequest, res: NextApiResponse) => {
	const players = await getPlayers({
		orderBy: { level: "desc" },
		select: { name: true, level: true },
		take: 5,
	});

	res.json({ success: true, args: { players } });
};

export default apiHandler({
	get,
});
