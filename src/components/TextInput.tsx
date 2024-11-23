import React from "react";
import { Input } from "@chakra-ui/react";

export interface TextInputProps {
	placeholder?: string;
	type?: string;
	name?: string;
}

const TextInput = ({
	placeholder,
	type = "text",
	name,
	...props
}: TextInputProps) => {
	return (
		<Input
			{...props}
			variant="filled"
			_focus={{ borderColor: "violet.400" }}
			_hover={{ borderColor: "violet.400" }}
			borderColor="violet.200"
			bg="white"
		/>
	);
};

export default TextInput;
