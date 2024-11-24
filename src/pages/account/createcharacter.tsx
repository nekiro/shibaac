import React, { useState } from "react";
import Panel from "../../components/Panel";
import { withSessionSsr } from "../../lib/session";
import { fetchApi } from "../../lib/request";
import FormWrapper, {
	FormButton,
	FormField,
} from "../../components/FormWrapper";
import { createCharacterSchema } from "../../schemas/CreateCharacter";
import { Select, Text } from "@chakra-ui/react";

const fields: FormField[] = [
	{
		type: "text",
		name: "name",
		placeholder: "3 to 29 characters",
		label: { text: "Name" },
	},
	{
		type: "select",
		as: Select,
		name: "vocation",
		label: { text: "Vocation" },

		options: [
			{ value: "1", text: "Sorcerer" },
			{ value: "2", text: "Druid" },
			{ value: "3", text: "Paladin" },
			{ value: "4", text: "Knight" },
		],
	},
	{
		type: "select",
		as: Select,
		name: "sex",
		label: { text: "Sex" },
		options: [
			{ value: "0", text: "Female" },
			{ value: "1", text: "Male" },
		],
	},
];

const buttons: FormButton[] = [
	{ type: "submit", btnColorType: "primary", value: "Submit" },
	{ href: "/account", value: "Back" },
];

const initialValues = {
	name: "",
	vocation: "1",
	sex: "0",
};

export default function CreateCharacter() {
	const [response, setResponse] = useState(null);

	const onSubmit = async (values, { resetForm }) => {
		const response = await fetchApi("POST", "/api/account/createcharacter", {
			data: {
				name: values.name,
				vocation: values.vocation,
				sex: values.sex,
			},
		});

		setResponse(response);
		resetForm();
	};

	return (
		<Panel header="Create Character">
			<Text align="center" margin="10px">
				Please choose a name, vocation and sex for your character. <br />
				In any case the name must not violate the naming conventions stated in
				the Rules or your character might get deleted or name locked.
			</Text>

			<FormWrapper
				validationSchema={createCharacterSchema}
				onSubmit={onSubmit}
				fields={fields}
				buttons={buttons}
				response={response}
				initialValues={initialValues}
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
		props: {},
	};
});
