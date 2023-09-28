import Panel from "src/components/Panel";
import { useRouter } from "next/router";
import FormWrapper from "src/components/FormWrapper";
import { searchCharacterSchema } from "src/schemas/SearchCharacter";

const fields = [
	{
		type: "text",
		name: "name",
		label: { text: "Character Name", size: 3 },
		size: 7,
	},
];

const buttons = [{ type: "submit", btnType: "primary", value: "Submit" }];

export default function Character() {
	const router = useRouter();

	const onSubmit = async (values) => {
		router.push(`/character/${values.name}`);
	};

	return (
		<Panel header="Search Character">
			<FormWrapper
				validationSchema={searchCharacterSchema}
				onSubmit={onSubmit}
				fields={fields}
				buttons={buttons}
			/>
		</Panel>
	);
}
