import * as yup from "yup";

export const changePasswordSchema = yup.object().shape({
	newPassword: yup.string().required("Required").min(6).max(30),
	repeatNewPassword: yup.string().required("Required"),
	// .when("newPassword", {
	// 	is: (val: any) => (val?.length > 0 ? true : false),
	// 	then: yup.string().oneOf([yup.ref("newPassword")], "Both password need to be the same"),
	// })
	password: yup.string().required("Required"),
	// .when("newPassword", {
	// 	is: (val: any) => (val?.length > 0 ? true : false),
	// 	then: yup.string().notOneOf([yup.ref("newPassword")], "New password must be different than current one"),
	// })
});

export type ChangePassword = yup.InferType<typeof changePasswordSchema>;
