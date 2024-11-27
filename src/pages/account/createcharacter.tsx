import React from "react";
import Panel from "../../components/Panel";
import { withSessionSsr } from "../../lib/session";
import { Select, Text, Container, VStack, Wrap } from "@chakra-ui/react";
import TextInput from "@component/TextInput";
import Button from "@component/Button";
import { FormField } from "@component/FormField";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler } from "react-hook-form";
import { Vocation } from "@shared/enums/Vocation";
import { trpc } from "@util/trpc";
import { useFormFeedback } from "@hook/useFormFeedback";
import { Sex } from "@shared/enums/Sex";

const bannedSequences = ["tutor", "cancer", "suck", "sux", "fuck"];
const bannedWords = ["gm", "cm", "god"];

// Names is valid when:
// - doesn't contains banned words
// - has minimum of 3 letters and maximum of 29 characters
// - first letter is upper case alphabet character
// - last letter is lower case alphabet character
// - doesn't have more than 3 words
// - contains only alphabet letters and spaces

const schema = z.object({
	name: z
		.string()
		.min(3, { message: "Field is required and must be at least 3 characters long" })
		.max(29, { message: "Field must be at most 29 characters long" })
		.regex(/^[aA-zZ\s]+$/, { message: "Invalid letters, words or format. Use a-Z and spaces." })
		.refine(
			(value) => {
				const sequences = bannedSequences.filter((str) => value.split(" ").join("").toLowerCase().includes(str.toLowerCase()));
				return sequences.length === 0;
			},
			{ message: "Contains illegal words" },
		)
		.refine((value) => /^[A-Z]/.test(value.charAt(0)), { message: "First letter must be an A-Z capital letter." })
		.refine((value) => /[a-z]$/.test(value.charAt(value.length - 1)), { message: "Last letter must be an a-z letter." })
		.refine((value) => !/\s\s+/.test(value), { message: "Name can't have more than one space in a row." })
		.refine((value) => value.split(" ").length <= 3, { message: "Name can't have more than three words." })
		.refine(
			(value) => {
				const words = value.split(" ").filter((str) => bannedWords.includes(str.toLowerCase()));
				return words.length === 0;
			},
			{ message: "Contains illegal words" },
		),
	vocation: z.nativeEnum(Vocation),
	sex: z.nativeEnum(Sex),
});

export default function CreateCharacter() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});
	const createCharacter = trpc.account.createCharacter.useMutation();
	const { handleResponse, showResponse } = useFormFeedback();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ name, vocation, sex }) => {
		handleResponse(async () => {
			await createCharacter.mutateAsync({ name, vocation, sex });
			showResponse("Character created.", "success");
		});

		reset();
	};

	return (
		<Panel header="Create Character">
			<Text align="center" margin="10px">
				Please choose a name, vocation and sex for your character. <br />
				In any case the name must not violate the naming conventions stated in the Rules or your character might get deleted or name locked.
			</Text>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Container alignContent={"center"} padding={2}>
					<VStack spacing={5}>
						<FormField key={"name"} error={errors.name?.message} name={"name"} label={"Name"}>
							<TextInput type="name" {...register("name")} />
						</FormField>
						<FormField key={"vocation"} error={errors.vocation?.message} name={"vocation"} label="Vocation">
							<Select {...register("vocation")}>
								{Object.entries(Vocation).map(([key, value]) => (
									<option value={value}>{key}</option>
								))}
							</Select>
						</FormField>
						<FormField key={"sex"} error={errors.sex?.message} name={"sex"} label="Sex">
							<Select {...register("sex")}>
								{Object.entries(Sex).map(([key, value]) => (
									<option value={value}>{key}</option>
								))}
							</Select>
						</FormField>
						<Wrap spacing={2} padding="10px">
							<Button isLoading={isSubmitting} isActive={!isValid} loadingText="Submitting" type="submit" value="Submit" btnColorType="primary" />
							<Button value="Back" btnColorType="danger" href="/account" />
						</Wrap>
					</VStack>
				</Container>
			</form>
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
