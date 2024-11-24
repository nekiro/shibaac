import { NextApiHandler } from "next";

type Handler = {
	get?: NextApiHandler;
	post?: NextApiHandler;
};

const apiHandler =
	(handler: Handler): NextApiHandler =>
	async (req, res) => {
		const method = req.method?.toLowerCase() as string;

		// check handler supports HTTP method
		const callback = (handler as any)[method] as NextApiHandler;
		if (!callback) {
			return res.status(405).json({ success: false, message: `Method Not Allowed` });
		}

		try {
			await callback(req, res);
		} catch (err) {
			console.log(err);
			res.status(500).json({ success: false, message: (err as Error).message });
		}
	};

export default apiHandler;
