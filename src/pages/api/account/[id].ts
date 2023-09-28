import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "../../../middleware/apiHandler";
import * as accountService from "../../../services/accountService";

//TODO: accept query parameters to pull only required data

const get = async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.query;

	if (!id) {
		return res.json({
			success: false,
			message: "Missing account id query parameter",
		});
	}

	const account = await accountService.getAccountById(+id);
	if (!account) {
		return res.json({ success: false, message: "Account not found" });
	}

	res.status(200).json({ success: true, args: { account } });
};

export default apiHandler({
	get,
});
