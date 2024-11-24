import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
	name: Yup.string()
		.required("Required")
		.min(5)
		.max(20)
		.matches(/^[aA-zZ0-9]+$/, "Invalid letters, words or format. Use a-Z and spaces."),
	password: Yup.string().required("Required").min(8).max(20),
	// repeatPassword: Yup.string().when("password", {
	// 	is: (val: string) => (val?.length > 0 ? true : false),
	// 	then: Yup.string().oneOf([Yup.ref("password")], "Both password need to be the same"),
	// }),
	email: Yup.string().email().required("Required"),
});

export type Register = Yup.InferType<typeof registerSchema>;
