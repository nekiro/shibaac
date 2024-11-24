import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ValidationError, AnyObjectSchema } from "yup";

export const validate =
	(schema: AnyObjectSchema, handler: NextApiHandler): NextApiHandler =>
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			if (req.body) {
				req.body = await schema.camelCase().validate(req.body, { abortEarly: false });
			}
		} catch (yupError) {
			if (yupError instanceof ValidationError) {
				return res.status(400).json({ success: false, message: yupError.errors.join(", ") });
			}

			return res.status(500).json({ success: false });
		}

		await handler(req, res);
	};
