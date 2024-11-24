import Panel from "src/components/Panel";
import { useRouter } from "next/router";
import FormWrapper, { FormField } from "src/components/FormWrapper";
import { searchCharacterSchema } from "src/schemas/SearchCharacter";
import { FormButton } from "../community/guilds";

const fields: FormField[] = [
	{
		type: "text",
		name: "name",
		label: { text: "Character Name" },
	},
];

const buttons: FormButton[] = [{ type: "submit", btnType: "primary", value: "Submit" }];

export default function Character() {
	const router = useRouter();

	const onSubmit = async (values: any) => {
		router.push(`/character/${values.name}`);
	};

	return (
		<Panel header="Search Character">
			<FormWrapper validationSchema={searchCharacterSchema} onSubmit={onSubmit} fields={fields} buttons={buttons} />
		</Panel>
	);
}
