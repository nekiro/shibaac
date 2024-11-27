import React from "react";
import Panel from "@component/Panel";
import Head from "../../layout/Head";
import { withSessionSsr } from "@lib/session";
import { trpc } from "@util/trpc";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@component/TextInput";
import { Container, VStack, Wrap } from "@chakra-ui/react";
import Button from "@component/Button";
import { FormField } from "@component/FormField";
import { useFormFeedback } from "@hook/useFormFeedback";

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
		formState: { errors, isValid, isSubmitting },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});
	const { handleResponse, showResponse } = useFormFeedback();
	const createAccount = trpc.account.create.useMutation();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
		handleResponse(async () => {
			await createAccount.mutateAsync({
				name: values.name,
				password: values.password,
				email: values.email,
			});

			showResponse("Account created successfuly", "success");
		});

		reset();
	};

	return (
		<>
			<Head title="Register" />
			<Panel header="Register">
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
								<Button value="Reset" btnColorType="danger" />
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
