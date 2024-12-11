import { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export interface CaptchaProps {
	onChange: (token: string | null) => void;
}

export const Captcha = forwardRef<ReCAPTCHA, CaptchaProps>(({ onChange }, ref) => {
	return <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!} onChange={onChange} ref={ref} />;
});

Captcha.displayName = "Captcha";
