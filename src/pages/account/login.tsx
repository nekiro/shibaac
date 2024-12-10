import React, { useRef } from "react";
import Panel from "@component/Panel";
import Head from "@layout/Head";
import Link from "@component/Link";
import { useRouter } from "next/router";
import { withSessionSsr } from "@lib/session";
import { Text, VStack } from "@chakra-ui/react";
import { trpc } from "@util/trpc";
import { useFormFeedback } from "@hook/useFormFeedback";
import TextInput from "@component/TextInput";
import Button from "@component/Button";
import { FormField } from "@component/FormField";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Captcha } from "@component/Captcha";
import ReCAPTCHA from "react-google-recaptcha";

const fields = [
	{ type: "input", name: "name", label: "Account Name" },
	{ type: "password", name: "password", label: "Password" },
	// {
	// 	type: "text",
	// 	name: "twoFAToken",
	// 	placeholder: "If you have 2FA, code: XXX-XXX",
	// 	label: "2FA Token",
	// },
];

// TODO: add 2FA support

const schema = z.object({
	name: z.string().min(5, { message: "Account name must be at least 5 characters long" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
	captcha: z.string({ message: "Captcha is required" }),
});

export default function Login() {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		trigger,
		formState: { errors, isValid, isSubmitting },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});
	const captchaRef = useRef<ReCAPTCHA>(null);
	const router = useRouter();
	const login = trpc.account.login.useMutation();
	const { handleResponse, showResponse } = useFormFeedback();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ name, password, captcha }) => {
		handleResponse(async () => {
			const account = await login.mutateAsync({ name, password, captchaToken: captcha });
			if (account) {
				const redirectUrl = (router.query.redirect as string) || "/account";
				router.push(redirectUrl);
			}

			showResponse("Logged in.", "success");
		});

		reset();

		if (captchaRef.current) {
			captchaRef.current.reset();
		}
	};

	return (
		<>
			<Head title="Log In" />
			<Panel header="Log In">
				<VStack>
					<form onSubmit={handleSubmit(onSubmit)}>
						<VStack spacing={5}>
							{fields.map((field) => (
								<FormField key={field.name} error={(errors as any)[field.name]?.message} name={field.name} label={field.label}>
									<TextInput type={field.type} {...register(field.name as any)} />
								</FormField>
							))}

							<FormField error={errors.captcha?.message} name="Captcha" justifyItems="center">
								<Captcha
									{...register("captcha")}
									onChange={(token) => {
										setValue("captcha", token ?? "");
										trigger("captcha");
									}}
									ref={captchaRef}
								/>
							</FormField>

							<Button
								isLoading={isSubmitting}
								isActive={!isValid}
								width="100%"
								loadingText="Submitting"
								type="submit"
								value="Log In"
								btnColorType="primary"
							/>

							<Text align="center">
								Don&apos;t have an account? <Link href="/account/register">Register</Link>
							</Text>

							<Link href="/account/lost">Forgot password?</Link>
						</VStack>
					</form>
				</VStack>
			</Panel>
		</>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
	const { account } = req.session;
	if (account) {
		return {
			redirect: {
				destination: "/account",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
});
