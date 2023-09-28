import { validate } from "../../../middleware/validation";
import { registerSchema } from "../../../schemas/Register";
import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "../../../middleware/apiHandler";
import * as accountService from "../../../services/accountService";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
	const { name, password, email } = req.body;

	let account = await accountService.getAccountByName(name);
	if (account) {
		return res.status(400).json({
			success: false,
			message: "Account with that name already exists.",
		});
	}

	account = await accountService.createAccount(name, password, email);
	if (!account) {
		return res.status(500).json({
			success: false,
			message: "Error occured while creating account",
		});
	}

	res.json({
		success: true,
		args: { account },
		message: "Account created successfuly",
	});
};

export default apiHandler({
	post: validate(registerSchema, post),
});
