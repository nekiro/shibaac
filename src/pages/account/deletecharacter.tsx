import React from "react";
import Panel from "@component/Panel";
import { withSessionSsr } from "@lib/session";
import { Select, Text, Container, VStack, Wrap } from "@chakra-ui/react";
import { trpc } from "@util/trpc";
import { useFormFeedback } from "@hook/useFormFeedback";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@component/TextInput";
import Button from "@component/Button";
import { FormField } from "@component/FormField";
import type { AccountWithPlayers } from "@shared/types/PrismaAccount";

const schema = z.object({
	name: z.string(),
	password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export interface DeleteCharacterProps {
	account: AccountWithPlayers;
}

export default function DeleteCharacter({ account }: DeleteCharacterProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});

	const deleteCharacter = trpc.account.deleteCharacter.useMutation();
	const { showResponse, handleResponse } = useFormFeedback();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ name, password }) => {
		handleResponse(async () => {
			await deleteCharacter.mutateAsync({ name, password });
			showResponse("Character deleted.", "success");
		});

		reset();
	};

	return (
		<Panel header="Delete Character">
			<Text align="center" margin="10px">
				To delete a character choose the character and enter your password.
			</Text>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Container alignContent={"center"} padding={2}>
					<VStack spacing={5}>
						<FormField key={"name"} error={errors.name?.message} name={"name"} label="Character Name">
							<Select {...register("name")}>
								{account.players.map((character) => (
									<option key={character.name} value={character.name}>
										{character.name}
									</option>
								))}
							</Select>
						</FormField>
						<FormField key={"password"} error={errors.password?.message} name={"password"} label={"Current Password"}>
							<TextInput type="password" {...register("password")} />
						</FormField>
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
	const { account } = req.session;
	if (!account) {
		return {
			redirect: {
				destination: `/account/login?redirect=${encodeURIComponent(req.url!)}`,
				permanent: false,
			},
		};
	}

	return {
		props: { account },
	};
});
