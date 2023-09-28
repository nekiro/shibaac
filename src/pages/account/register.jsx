import React, { useState } from "react";
import Panel from "src/components/Panel";
import Head from "src/layout/Head";
import { withSessionSsr } from "src/lib/session";
import { fetchApi } from "src/lib/request";
import FormWrapper from "src/components/FormWrapper";
import { registerSchema } from "src/schemas/Register";

const fields = [
	{
		type: "text",
		name: "name",
		label: { text: "Account Name", size: 3 },
		size: 9,
	},
	{
		type: "password",
		name: "password",
		label: { text: "Password", size: 3 },
		size: 9,
	},
	{
		type: "password",
		name: "repeatPassword",
		label: { text: "Repeat Password", size: 3 },
		size: 9,
	},
	{
		type: "email",
		name: "email",
		label: { text: "Email Address", size: 3 },
		size: 9,
	},
];

const buttons = [
	{ type: "submit", btnType: "primary", value: "Submit" },
	{ value: "Reset" },
];

export default function Register() {
	const [response, setResponse] = useState(null);

	const onSubmit = async (values, { resetForm }) => {
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
