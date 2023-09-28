import * as Yup from "yup";

export const changePasswordSchema = Yup.object().shape({
	newPassword: Yup.string().required("Required").min(6).max(30),
	repeatNewPassword: Yup.string()
		.required("Required")
		.when("newPassword", {
			is: (val: any) => (val?.length > 0 ? true : false),
			then: Yup.string().oneOf(
				[Yup.ref("newPassword")],
				"Both password need to be the same"
			),
		}),
	password: Yup.string()
		.required("Required")
		.when("newPassword", {
			is: (val: any) => (val?.length > 0 ? true : false),
			then: Yup.string().notOneOf(
				[Yup.ref("newPassword")],
				"New password must be different than current one"
			),
		}),
});

export type ChangePassword = Yup.TypeOf<typeof changePasswordSchema>;
