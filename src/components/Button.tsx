import React from "react";
import Link from "next/link";
import { Button as ChakraButton } from "@chakra-ui/react";

const btnTypeToColor = { danger: "red", primary: "violet" };

export type ButtonType = "button" | "submit" | "reset";
export type ButtonColorType = "danger" | "primary";

type ButtonProps = {
	value: string;
	size?: string;
	type?: ButtonType;
	href?: string;
	btnColorType: ButtonColorType;
	isLoading: boolean;
	isActive: boolean;
	loadingText: string;
};

const Button = ({
	value,
	type = "button",
	btnColorType = "primary",
	size = "md",
	href,
	isLoading,
	isActive,
	loadingText,
}: ButtonProps) => {
	const btn = (
		<ChakraButton
			type={type}
			colorScheme={btnTypeToColor[btnColorType]}
			size={size}
			fontWeight="normal"
			isLoading={isLoading}
			isActive={isActive}
			loadingText={loadingText}
		>
			{value}
		</ChakraButton>
	);

	return href ? (
		<Link href={href} passHref>
			{btn}
		</Link>
	) : (
		btn
	);
};

export default Button;
