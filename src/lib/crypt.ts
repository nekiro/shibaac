import crypto from "crypto";

export const sha1Encrypt = (input: string): Promise<string> =>
	new Promise((resolve, reject) => {
		try {
			resolve(crypto.createHash("sha1").update(input, "utf-8").digest("hex"));
		} catch (err) {
			reject(err);
		}
	});
