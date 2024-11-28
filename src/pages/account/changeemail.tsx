import React, { useState } from "react";
import Panel from "../../components/Panel";
import FormWrapper, { FormButton, FormField } from "../../components/FormWrapper";
import { fetchApi, FetchResult } from "../../lib/request";
import { withSessionSsr } from "../../lib/session";
import { changeEmailSchema } from "../../schemas/ChangeEmail";

const fields: FormField[] = [
	{
		type: "email",
		name: "newEmail",
		label: { text: "E-mail Address" },
	},
	{
		type: "password",
		name: "password",
		label: { text: "Password" },
	},
];

const buttons: FormButton[] = [
	{ type: "submit", btnColorType: "primary", value: "Submit" },
	{ href: "/account", value: "Back" },
];

export default function ChangeEmail() {
	const [response, setResponse] = useState<FetchResult | undefined>(undefined);

	const onSubmit = async (values: any, { resetForm }: any) => {
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
			<FormWrapper validationSchema={changeEmailSchema} onSubmit={onSubmit} fields={fields} buttons={buttons} response={response} />
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
