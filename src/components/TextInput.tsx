import React, { forwardRef } from "react";
import { Input, InputProps } from "@chakra-ui/react";

export interface TextInputProps extends InputProps {}

const TextInput = forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
	return (
		<Input
			ref={ref}
			variant="filled"
			_focus={{ borderColor: "violet.400", backgroundColor: "white" }}
			_hover={{ borderColor: "violet.400" }}
			borderColor="violet.200"
			bg="white"
			{...props}
		/>
	);
});

TextInput.displayName = "TextInput";

export default TextInput;
