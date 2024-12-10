import { FormControl, FormLabel, FormErrorMessage, FormControlProps } from "@chakra-ui/react";

export interface FormFieldProps extends FormControlProps {
	name: string;
	label?: string;
	error?: string;
}

export const FormField = ({ name, label, error, children, ...props }: FormFieldProps) => {
	return (
		<FormControl key={name} isInvalid={!!error} {...props}>
			{label && (
				<FormLabel fontSize="sm" htmlFor={name}>
					{label}
				</FormLabel>
			)}
			{children}
			{error && <FormErrorMessage fontSize="sm">{error}</FormErrorMessage>}
		</FormControl>
	);
};
