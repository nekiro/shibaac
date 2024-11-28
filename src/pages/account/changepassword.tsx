import React from "react";
import Panel from "@component/Panel";
import { withSessionSsr } from "@lib/session";
import { trpc } from "@util/trpc";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Text, Container, VStack, Wrap } from "@chakra-ui/react";
import TextInput from "@component/TextInput";
import Button from "@component/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@component/FormField";
import { useFormFeedback } from "@hook/useFormFeedback";

const fields = [
	{
		type: "password",
		name: "newPassword",
		placeholder: "6 to 30 characters",
		label: "New Password",
	},
	{
		type: "password",
		name: "repeatNewPassword",
		label: "Repeat New Password",
	},
	{
		type: "password",
		name: "password",
		label: "Password",
	},
];

const schema = z
	.object({
		newPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
		repeatNewPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
		password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
	})
	.refine((data) => data.newPassword === data.repeatNewPassword, {
		message: "New passwords don't match",
		path: ["repeatNewPassword"],
	});

export default function ChangePassword() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});
	const { handleResponse, showResponse } = useFormFeedback();
	const changePassword = trpc.account.changePassword.useMutation();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ newPassword, password }) => {
		handleResponse(async () => {
			await changePassword.mutateAsync({
				newPassword,
				password,
			});

			showResponse("Password changed.", "success");
		});

		reset();
	};

	return (
		<Panel header="Change Password">
			<Text align="center" margin="10px">
				Please enter your current password and a new password. For your security, please enter the new password twice.
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
							<Button value="Back" btnColorType="danger" href="/account" />
						</Wrap>
					</VStack>
				</Container>
			</form>
		</Panel>
	);
}

export const getServerSideProps = withSessionSsr(function ({ req }) {
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
