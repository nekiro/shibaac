import React, { useState } from "react";
import Panel from "../../components/Panel";
import FormWrapper, {
	FormButton,
	FormField,
} from "../../components/FormWrapper";
import { fetchApi, FetchResult } from "../../lib/request";
import { withSessionSsr } from "../../lib/session";
import { changePasswordSchema } from "../../schemas/ChangePassword";
import { Text } from "@chakra-ui/react";

const fields: FormField[] = [
	{
		type: "password",
		name: "newPassword",
		placeholder: "6 to 30 characters",
		label: { text: "New Password" },
	},
	{
		type: "password",
		name: "repeatNewPassword",
		label: { text: "Repeat New Password" },
	},
	{
		type: "password",
		name: "password",
		label: { text: "Password" },
	},
];

const buttons: FormButton[] = [
	{ type: "submit", btnColorType: "primary", value: "Submit" },
	{ href: "/account", btnColorType: "danger", value: "Back" },
];

export default function ChangePassword() {
	const [response, setResponse] = useState<FetchResult | null>(null);

	const onSubmit = async (values, { resetForm }) => {
		const response = await fetchApi("POST", "/api/account/changepassword", {
			data: {
				newPassword: values.newPassword,
				password: values.password,
			},
		});

		setResponse(response);
		resetForm();
	};

	return (
		<Panel header="Change Password">
			<Text align="center" margin="10px">
				Please enter your current password and a new password. For your
				security, please enter the new password twice.
			</Text>

			<FormWrapper
				validationSchema={changePasswordSchema}
				onSubmit={onSubmit}
				fields={fields}
				buttons={buttons}
				response={response}
			/>
		</Panel>
	);
}

export const getServerSideProps = withSessionSsr(function ({ req }) {
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
