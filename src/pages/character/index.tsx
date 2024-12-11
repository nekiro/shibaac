import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VStack } from "@chakra-ui/react";
import TextInput from "@component/TextInput";
import { FormField } from "@component/FormField";
import { Content } from "@component/Content";
import Button from "@component/Button";

const schema = z.object({
	name: z.string(),
});

export default function Character() {
	const {
		register,
		handleSubmit,

		formState: { errors, isValid, isSubmitting },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});
	const router = useRouter();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async ({ name }) => {
		router.push(`/character/${name}`);
	};

	return (
		<Content>
			<Content.Header>Find Character</Content.Header>
			<Content.Body maxW="25em">
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing={10}>
						<FormField key="name" error={errors.name?.message} name="name" label="Name">
							<TextInput type="text" {...register("name")} />
						</FormField>
						<Button
							isLoading={isSubmitting}
							width="100%"
							isActive={!isValid}
							loadingText="Submitting"
							type="submit"
							value="Search"
							btnColorType="primary"
						/>
					</VStack>
				</form>
			</Content.Body>
		</Content>
	);
}
