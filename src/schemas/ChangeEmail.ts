import * as Yup from "yup";

export const changeEmailSchema = Yup.object().shape({
	newEmail: Yup.string().email("Must be a valid email.").required("Required"),
	password: Yup.string().required("Required"),
});

export type ChangeEmail = Yup.TypeOf<typeof changeEmailSchema>;
