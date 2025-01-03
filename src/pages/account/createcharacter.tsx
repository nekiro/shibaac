import { withSessionSsr } from "@lib/session";
import { Select, Text, VStack } from "@chakra-ui/react";
import TextInput from "@component/TextInput";
import Button from "@component/Button";
import { FormField } from "@component/FormField";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getVocationNames, getVocationByName } from "@shared/enums/Vocation";
import { trpc } from "@util/trpc";
import { useFormFeedback } from "@hook/useFormFeedback";
import { getSexNames, getSexByName } from "@shared/enums/Sex";
import { Content } from "@component/Content";
import { useRouter } from "next/router";

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
	vocation: z.enum(getVocationNames() as any).transform((val) => getVocationByName(val)),
	sex: z.enum(getSexNames() as any).transform((val) => getSexByName(val)),
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
	const router = useRouter();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ name, vocation, sex }) => {
		handleResponse(async () => {
			await createCharacter.mutateAsync({ name, vocation, sex });
			showResponse("Character created.", "success");
			router.push("/account");
		});

		reset();
	};

	return (
		<Content>
			<Content.Header>Create Character</Content.Header>
			<Content.Body>
				<Text align="center">
					Please choose a name, vocation and sex for your character. <br />
					In any case the name must not violate the naming conventions stated in the Rules or your character might get deleted or name locked.
				</Text>
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing={10}>
						<FormField key={"name"} error={errors.name?.message} name={"name"} label={"Name"}>
							<TextInput type="name" {...register("name")} />
						</FormField>
						<FormField key={"vocation"} error={errors.vocation?.message} name={"vocation"} label="Vocation">
							<Select {...register("vocation")}>
								{getVocationNames().map((key) => (
									<option key={key} value={key}>
										{key}
									</option>
								))}
							</Select>
						</FormField>
						<FormField key={"sex"} error={errors.sex?.message} name={"sex"} label="Sex">
							<Select {...register("sex")}>
								{getSexNames().map((key) => (
									<option key={key} value={key}>
										{key}
									</option>
								))}
							</Select>
						</FormField>
						<Button
							width="100%"
							isLoading={isSubmitting}
							isActive={!isValid}
							loadingText="Submitting"
							type="submit"
							value="Submit"
							btnColorType="primary"
						/>
						<Button width="100%" value="Back" btnColorType="danger" href="/account" />
					</VStack>
				</form>
			</Content.Body>
		</Content>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
	const { account } = req.session;
	if (!account) {
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
