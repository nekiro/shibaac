import React from "react";
import Panel from "@component/Panel";
import Head from "../../layout/Head";
import Link from "@component/Link";
import { useRouter } from "next/router";
import { withSessionSsr } from "@lib/session";
import { useUser } from "@hook/useUser";
import { Text, Container, VStack, Wrap } from "@chakra-ui/react";
import { trpc } from "@util/trpc";
import { useFormFeedback } from "@hook/useFormFeedback";
import TextInput from "@component/TextInput";
import Button from "@component/Button";
import { FormField } from "@component/FormField";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const fields = [
	{ type: "password", name: "name", label: "Account Name" },
	{ type: "password", name: "password", label: "Password" },
	{
		type: "text",
		name: "twoFAToken",
		placeholder: "If you have 2FA, code: XXX-XXX",
		label: "2FA Token",
	},
];

// TODO: add 2FA support

const schema = z.object({
	name: z.string().min(5, { message: "Account name must be at least 5 characters long" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export default function Login() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});
	const { setUser } = useUser();
	const router = useRouter();
	const login = trpc.account.login.useMutation();
	const { handleResponse, showResponse } = useFormFeedback();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ name, password }) => {
		handleResponse(async () => {
			const account = await login.mutateAsync({ name, password });
			if (account) {
				setUser(account);
				router.push("/account");
			}

			showResponse("Logged in.", "success");
		});

		reset();
	};

	return (
		<>
			<Head title="Login" />
			<Panel header="Login">
				<Text align="center" margin="10px">
					Please enter your account name and your password.
				</Text>
				<Text align="center" margin="10px">
					<Link href="/account/register" text="Create an account " />
					if you do not have one yet.
				</Text>

				<form onSubmit={handleSubmit(onSubmit)}>
					<Container alignContent={"center"} padding={2}>
						<VStack spacing={5}>
							{fields.map((field) => (
								<FormField key={field.name} error={(errors as any)[field.name]?.message} name={field.name} label={field.label}>
									<TextInput type={field.type} {...register(field.name as any)} />
								</FormField>
							))}
							<Wrap spacing={2} padding="10px">
								<Button isLoading={isSubmitting} isActive={!isValid} loadingText="Submitting" type="submit" value="Submit" btnColorType="primary" />
								<Button value="Lost Account?" btnColorType="danger" href="/account/lost" />
							</Wrap>
						</VStack>
					</Container>
				</form>
			</Panel>
		</>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
	const { user } = req.session;
	if (user) {
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
