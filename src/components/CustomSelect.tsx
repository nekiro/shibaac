import React from "react";
import { Select, SelectProps } from "@chakra-ui/react";

export interface CustomSelectProps extends SelectProps {
	options: { value: string; text: string }[];
}

export const CustomSelect = ({ options, ...props }: CustomSelectProps) => {
	return (
		<Select {...props}>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.text}
				</option>
			))}
		</Select>
	);
};
