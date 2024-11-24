import React from "react";
import { Input, InputProps } from "@chakra-ui/react";

export interface TextInputProps extends InputProps {
	type?: string;
}

const TextInput = ({ type = "text", ...props }: TextInputProps) => {
	return (
		<Input
			{...props}
			variant="filled"
			_focus={{ borderColor: "violet.400", backgroundColor: "white" }}
			_hover={{ borderColor: "violet.400" }}
			borderColor="violet.200"
			bg="white"
		/>
	);
};

export default TextInput;
