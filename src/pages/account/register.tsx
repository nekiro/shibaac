import { useRef } from "react";
import Head from "@layout/Head";
import { withSessionSsr } from "@lib/session";
import { trpc } from "@util/trpc";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@component/TextInput";
import { Text, VStack } from "@chakra-ui/react";
import Button from "@component/Button";
import { FormField } from "@component/FormField";
import { useFormFeedback } from "@hook/useFormFeedback";
import { useRouter } from "next/router";
import { Captcha } from "@component/Captcha";
import ReCAPTCHA from "react-google-recaptcha";
import { Content } from "@component/Content";
import Link from "@component/Link";

const fields = [
	{
		type: "text",
		name: "name",
		label: "Account Name",
	},
	{
		type: "password",
		name: "password",
		label: "Password",
	},
	{
		type: "password",
		name: "repeatPassword",
		label: "Repeat Password",
	},
	{
		type: "email",
		name: "email",
		label: "Email Address",
	},
];

const isCaptchaRequired = Boolean(process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY);

const schema = z
	.object({
		name: z.string().min(5, { message: "Account name must be at least 5 characters long" }),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" })
			.max(20, { message: "Password must be at most 20 characters long" })
			.regex(/^[aA-zZ0-9]+$/, "Invalid letters, words or format. Use a-Z and spaces."),
		repeatPassword: z.string(),
		email: z.string().email({ message: "Invalid email address" }),
		captcha: isCaptchaRequired ? z.string({ message: "Captcha is required" }) : z.string().optional(),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: "Passwords don't match",
		path: ["repeatPassword"],
	});

export default function Register() {
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
	const { handleResponse, showResponse } = useFormFeedback();
	const createAccount = trpc.account.create.useMutation();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ name, password, email, captcha }) => {
		handleResponse(async () => {
			await createAccount.mutateAsync({
				name,
				password,
				email,
				captchaToken: captcha,
			});

			showResponse("Account created successfully. You can login now.", "success");
			router.push("/account/login");
		});

		reset();
		if (captchaRef.current) {
			captchaRef.current.reset();
		}
	};

	return (
		<>
			<Head title="Register" />
			<Content>
				<Content.Header>Register</Content.Header>
				<Content.Body>
					<form onSubmit={handleSubmit(onSubmit)}>
						<VStack spacing={10} w="25rem" maxW="25rem">
							{fields.map((field) => (
								<FormField key={field.name} error={(errors as any)[field.name]?.message} name={field.name} label={field.label}>
									<TextInput type={field.type} {...register(field.name as any)} />
								</FormField>
							))}
							{process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY && (
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
							)}
							<Button
								isLoading={isSubmitting}
								width="100%"
								isActive={!isValid}
								loadingText="Submitting"
								type="submit"
								value="Register"
								btnColorType="primary"
							/>
							<VStack>
								<Text>
									By creating an account you agree to our{" "}
									<Link textDecoration="underline" href="/rules">
										rules
									</Link>
									.
								</Text>
								<Text align="center">
									Have an account?{" "}
									<Link textDecoration="underline" href="/account/login">
										Login
									</Link>
								</Text>
							</VStack>
						</VStack>
					</form>
				</Content.Body>
			</Content>
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
