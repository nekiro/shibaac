import React from "react";
import Panel from "@component/Panel";
import { withSessionSsr } from "@lib/session";
import { trpc } from "@util/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormFeedback } from "@hook/useFormFeedback";
import { Container, VStack, Wrap } from "@chakra-ui/react";
import TextInput from "@component/TextInput";
import Button from "@component/Button";
import { FormField } from "@component/FormField";

const fields = [
	{
		type: "email",
		name: "newEmail",
		label: "E-mail Address",
	},
	{
		type: "password",
		name: "password",
		label: "Password",
	},
];

const schema = z.object({
	newEmail: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export default function ChangeEmail() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});
	const { handleResponse, showResponse } = useFormFeedback();
	const changeEmail = trpc.account.changeEmail.useMutation();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ newEmail, password }) => {
		handleResponse(async () => {
			await changeEmail.mutateAsync({ newEmail, password });
			showResponse("Email changed.", "success");
		});

		reset();
	};

	return (
		<Panel header="Change Email">
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
							<Button value="Back" btnColorType="danger" href="/account" />
						</Wrap>
					</VStack>
				</Container>
			</form>
		</Panel>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
	const { user } = req.session;
	if (!user) {
		return {
			redirect: {
				destination: `/account/login?redirect=${encodeURIComponent(req.url!)}`,
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
});
