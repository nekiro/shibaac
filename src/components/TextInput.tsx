import React, { forwardRef } from "react";
import { Input, InputProps } from "@chakra-ui/react";
import { useColors } from "@hook/useColors";

export interface TextInputProps extends InputProps {}

const TextInput = forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
	const { inputBgColor } = useColors();

	return (
		<Input
			ref={ref}
			variant="filled"
			_hover={{ borderColor: "violet.400", bgColor: "violet.100" }}
			_focus={{ borderColor: "violet.400", bgColor: "violet.100" }}
			_placeholder={{ color: "violet.400" }}
			borderColor="violet.200"
			bg={inputBgColor}
			color="black"
			{...props}
		/>
	);
});

TextInput.displayName = "TextInput";

export default TextInput;
