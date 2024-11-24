import * as yup from "yup";

export const changeEmailSchema = yup.object().shape({
	newEmail: yup.string().email("Must be a valid email.").required("Required"),
	password: yup.string().required("Required"),
});

export type ChangeEmail = yup.InferType<typeof changeEmailSchema>;
