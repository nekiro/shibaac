import React, { useEffect, useState, useCallback } from "react";
import Panel from "../../components/Panel";
import { withSessionSsr } from "../../lib/session";
import { fetchApi } from "../../lib/request";
import FormWrapper, { FormButton } from "../../components/FormWrapper";
import { deleteCharacterSchema } from "../../schemas/DeleteCharacter";
import { Select, Text } from "@chakra-ui/react";

const buttons: FormButton[] = [
	{ type: "submit", btnColorType: "primary", value: "Submit" },
	{ href: "/account", value: "Back" },
];

interface DeleteCharacterProps {
	user: { id: number };
}

export default function DeleteCharacter({ user }: DeleteCharacterProps) {
	const [response, setResponse] = useState<any>(null);
	const [data, setData] = useState<any>(null);

	const fetchCharacters = useCallback(async () => {
		const response = await fetchApi<any>("GET", `/api/account/${user.id}`);
		if (response.success) {
			setData({
				fields: [
					{
						as: Select,
						name: "name",
						label: { text: "Name", size: 3 },
						size: 9,
						options: response.account.players.map((char: any) => ({
							value: char.name,
							text: char.name,
						})),
					},
					{
						type: "password",
						name: "password",
						label: { text: "Password", size: 3 },
						size: 9,
					},
				],
				initialValues: {
					name: response.account.players[0]?.name,
					password: "",
				},
			});
		}
	}, [user]);

	useEffect(() => {
		fetchCharacters();
	}, [fetchCharacters]);

	if (!data) {
		return <Panel isLoading={true} />;
	}

	const onSubmit = async (values: any, { resetForm }: any) => {
		const response = await fetchApi("POST", "/api/account/deletecharacter", {
			data: {
				name: values.name,
				password: values.password,
			},
		});

		setResponse(response);
		resetForm();
	};

	return (
		<Panel header="Delete Character">
			<Text align="center" margin="10px">
				To delete a character choose the character and enter your password.
			</Text>

			<FormWrapper
				validationSchema={deleteCharacterSchema}
				onSubmit={onSubmit}
				fields={data.fields}
				buttons={buttons}
				response={response}
				initialValues={data.initialValues}
			/>
		</Panel>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
	const { user } = req.session;
	if (!user) {
		return {
			redirect: {
				destination: "/account/login",
				permanent: false,
			},
		};
	}

	return {
		props: { user },
	};
});
