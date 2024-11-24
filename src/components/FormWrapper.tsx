import React, { useEffect } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import {
	VStack,
	FormControl,
	FormLabel,
	Container,
	FormErrorMessage,
	Wrap,
	useToast,
} from "@chakra-ui/react";
import TextInput from "./TextInput";
import Button, { ButtonType, ButtonColorType } from "./Button";
import { CustomSelect } from "./CustomSelect";
import { FetchResult } from "../lib/request";

export interface FormField {
	type: string;
	name: string;
	label: { text: string };
	placeholder?: string;
	as?: JSX.Element;
	options?: { value: string; text: string }[];
}

export interface FormButton {
	type?: ButtonType;
	btnColorType?: ButtonColorType;
	value: string;
	href?: string;
}

export interface FormWrapperProps {
	initialValues?: object;
	validationSchema: {};
	onSubmit: (
		values: unknown,
		formikHelpers: FormikHelpers<object>
	) => void | Promise<void>;
	fields: FormField[];
	buttons: FormButton[];
	response: FetchResult | null;
	validateOnMount?: boolean;
}

const FormWrapper = ({
	initialValues = {},
	validationSchema,
	onSubmit,
	fields,
	buttons,
	response,
	validateOnMount = false,
}: FormWrapperProps) => {
	const toast = useToast();

	useEffect(() => {
		if (
			response &&
			response.message?.length > 0 &&
			!toast.isActive("forms-response-toast")
		) {
			toast({
				position: "top",
				title: response.message,
				id: "forms-response-toast",
				status: response.success ? "success" : "error",
				isClosable: true,
				duration: 10000,
			});
		}
	}, [response, toast]);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
			validateOnMount={validateOnMount}
		>
			{({ errors, isValid, isSubmitting }) => (
				<Form>
					<Container alignContent={"center"} padding={2}>
						<VStack spacing={5}>
							{fields &&
								fields.map((field) => (
									<FormControl key={field.name} isInvalid={!isValid}>
										<FormLabel fontSize="sm" htmlFor={field.name}>
											{field.label.text}
										</FormLabel>
										{field.type === "select" ? (
											<Field
												name={field.name}
												as={CustomSelect}
												options={field.options}
											/>
										) : (
											<Field
												as={TextInput}
												type={field.type}
												name={field.name}
												placeholder={field.placeholder}
											/>
										)}
										<FormErrorMessage fontSize="sm">
											{errors[field.name] as string}
										</FormErrorMessage>
									</FormControl>
								))}

							<Wrap spacing={2} padding="10px">
								{buttons.map((button) => (
									<Button
										isLoading={button.type == "submit" && isSubmitting}
										isActive={button.type == "submit" && !isValid}
										loadingText="Submitting"
										key={button.value}
										type={button.type}
										value={button.value}
										btnColorType={button.btnColorType}
										href={button.href}
									/>
								))}
							</Wrap>
						</VStack>
					</Container>
				</Form>
			)}
		</Formik>
	);
};

export default FormWrapper;
