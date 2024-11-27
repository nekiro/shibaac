import Panel from "src/components/Panel";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, VStack } from "@chakra-ui/react";
import TextInput from "@component/TextInput";
import { FormField } from "@component/FormField";

const schema = z.object({
	name: z.string(),
});

export default function Character() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});
	const router = useRouter();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ name }) => {
		router.push(`/character/${name}`);
	};

	return (
		<Panel header="Search Character">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Container alignContent={"center"} padding={2}>
					<VStack spacing={5}>
						<FormField key={"name"} error={errors.name?.message} name="name" label="name">
							<TextInput type="submit" {...register("name")} />
						</FormField>
					</VStack>
				</Container>
			</form>
		</Panel>
	);
}
