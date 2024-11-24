import React from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

export interface LinkProps {
	href: string;
	text?: string;
}

const Link = ({ href, text }: LinkProps) => {
	return (
		<NextLink href={href} passHref>
			<ChakraLink color="violet.500">{text ?? href}</ChakraLink>
		</NextLink>
	);
};

export default Link;
