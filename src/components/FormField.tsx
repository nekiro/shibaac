import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export interface FormFieldProps extends PropsWithChildren {
	name: string;
	label: string;
	error?: string;
}

export const FormField = ({ name, label, error, children }: FormFieldProps) => {
	return (
		<FormControl key={name} isInvalid={!!error}>
			<FormLabel fontSize="sm" htmlFor={name}>
				{label}
			</FormLabel>
			{children}
			{error && <FormErrorMessage fontSize="sm">{error}</FormErrorMessage>}
		</FormControl>
	);
};
