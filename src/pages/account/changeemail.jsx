import React, { useState } from "react";
import Panel from "src/components/Panel";
import FormWrapper from "src/components/FormWrapper";
import { fetchApi } from "../../lib/request";
import { withSessionSsr } from "src/lib/session";
import { changeEmailSchema } from "src/schemas/ChangeEmail";

const fields = [
	{
		type: "email",
		name: "newEmail",
		label: { text: "E-mail Address", size: 2 },
		size: 10,
	},
	{
		type: "password",
		name: "password",
		label: { text: "Password", size: 2 },
		size: 10,
	},
];

const buttons = [
	{ type: "submit", btnType: "primary", value: "Submit" },
	{ href: "/account", value: "Back" },
];

export default function ChangeEmail() {
	const [response, setResponse] = useState(null);

	const onSubmit = async (values, { resetForm }) => {
		const response = await fetchApi("POST", "/api/account/changeemail", {
			data: {
				email: values.newEmail,
				password: values.password,
			},
		});

		setResponse(response);
		resetForm();
	};

	return (
		<Panel header="Change Email">
			<FormWrapper
				validationSchema={changeEmailSchema}
				onSubmit={onSubmit}
				fields={fields}
				buttons={buttons}
				response={response}
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
