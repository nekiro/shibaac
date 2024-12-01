import React from "react";
import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import NextLink from "next/link";

export interface LinkProps extends ChakraLinkProps {
	href: string;
	text?: string;
}

const Link = ({ href, text, children, ...props }: LinkProps) => {
	return (
		<ChakraLink as={NextLink} href={href} color="violet.500" {...props}>
			{text ?? children}
		</ChakraLink>
	);
};

export default Link;
