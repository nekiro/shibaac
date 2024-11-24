import React, { useState } from "react";
import Panel from "../../components/Panel";
import Head from "../../layout/Head";
import { withSessionSsr } from "../../lib/session";
import { fetchApi, FetchResult } from "../../lib/request";
import { registerSchema } from "../../schemas/Register";
import FormWrapper, {
	FormButton,
	FormField,
} from "../../components/FormWrapper";

const fields: FormField[] = [
	{
		type: "text",
		name: "name",
		label: { text: "Account Name" },
	},
	{
		type: "password",
		name: "password",
		label: { text: "Password" },
	},
	{
		type: "password",
		name: "repeatPassword",
		label: { text: "Repeat Password" },
	},
	{
		type: "email",
		name: "email",
		label: { text: "Email Address" },
	},
];

const buttons: FormButton[] = [
	{ type: "submit", btnColorType: "primary", value: "Submit" },
	{ value: "Reset", btnColorType: "danger" },
];

export default function Register() {
	const [response, setResponse] = useState<FetchResult | null>(null);

	const onSubmit = async (values: any, { resetForm }) => {
		const response = await fetchApi("POST", "/api/account/register", {
			data: {
				name: values.name,
				password: values.password,
				email: values.email,
			},
		});

		setResponse(response);
		resetForm();
	};

	return (
		<>
			<Head title="Register" />
			<Panel header="Register">
				<FormWrapper
					validationSchema={registerSchema}
					onSubmit={onSubmit}
					fields={fields}
					buttons={buttons}
					response={response}
				/>
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
