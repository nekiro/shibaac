import React from "react";
import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import NextLink from "next/link";

export interface LinkProps extends ChakraLinkProps {
	href: string;
	text?: string;
}

const Link = ({ href, text, ...props }: LinkProps) => {
	return (
		<NextLink href={href} passHref>
			<ChakraLink color="violet.500" {...props}>
				{text ?? href}
			</ChakraLink>
		</NextLink>
	);
};

export default Link;
