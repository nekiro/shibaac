import React from "react";
import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { useColors } from "@hook/useColors";

export interface LinkProps extends ChakraLinkProps {
	href: string;
	text?: string;
}

const Link = ({ href, text, children, ...props }: LinkProps) => {
	const { linkColor } = useColors();

	return (
		<ChakraLink as={NextLink} href={href} color={linkColor} {...props}>
			{text ?? children}
		</ChakraLink>
	);
};

export default Link;
