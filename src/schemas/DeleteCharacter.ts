import * as Yup from "yup";

export const deleteCharacterSchema = Yup.object().shape({
	password: Yup.string().required("Required"),
	name: Yup.string().required("Required"),
});

export type DeleteCharacter = Yup.InferType<typeof deleteCharacterSchema>;
