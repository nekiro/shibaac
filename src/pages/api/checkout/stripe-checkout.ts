import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../lib/session";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2024-11-20.acacia",
});

const post = withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const user = req.session.account;
		if (!user) {
			return res.status(403).json({ message: "Not authorized." });
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "brl", // TODO MAKE A SETTINGS TO CHANGE THIS CURRENCY
						product_data: {
							name: "Your Product Name", // TODO MAKE A SETTINGS TO CHANGE THIS NAME
						},
						unit_amount: req.body.price * 100,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${req.headers.origin}/success`,
			cancel_url: `${req.headers.origin}/cancel`,
		});

		res.status(200).json({ success: true, data: session });
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message });
	}
});

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "POST":
			return post(req, res);
		default:
			return res.status(405).json({ message: "Method not allowed" });
	}
};

export default handleRequest;
