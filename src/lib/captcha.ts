export const verifyCaptcha = async (token: string) => {
	if (!process.env.CAPTCHA_SECRET_KEY || !process.env.CATPCHA_VERIFY_URL) {
		return;
	}

	const verificationUrl = `${process.env.CATPCHA_VERIFY_URL}?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`;
	const captchaResponse = await fetch(verificationUrl, { method: "POST" });
	const captchaResult = await captchaResponse.json();

	if (!captchaResult.success) {
		throw new Error("Captcha verification failed.");
	}
};
