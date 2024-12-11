import React, { ReactNode } from "react";
import Loader from "./Loader";
import { Flex, Box, FlexProps, Heading } from "@chakra-ui/react";
import { useColors } from "@hook/useColors";

export interface PanelProps extends FlexProps {
	header?: string;
	identifier?: string | null;
	children?: ReactNode;
	isLoading?: boolean;
}

const Panel = ({
	header,
	identifier,
	children,
	isLoading = false,
	borderRadius = "none",
	padding = "10px",
	width,
	w,
	maxW,
	maxWidth,
	...props
}: PanelProps) => {
	const { bgColor, textColor } = useColors();

	return (
		<Flex
			key={identifier}
			width="100%"
			flexDirection="column"
			color={textColor}
			bgColor={bgColor}
			borderRadius={borderRadius}
			borderBottomRadius={0}
			rounded="md"
			padding="1em"
			w={{ lg: (width as string) ?? w, base: "100%" }}
			maxW={{ lg: (maxW as string) ?? maxWidth, base: "100%" }}
			{...props}
		>
			{header && (
				<Flex justifyContent="center" borderRadius={borderRadius} fontWeight="bold" paddingBottom="1em" rounded="md">
					<Heading as="h1" size="md" color={textColor}>
						{header}
					</Heading>
				</Flex>
			)}
			<Box padding={padding}>{isLoading ? <Loader /> : children}</Box>
		</Flex>
	);
};

export default Panel;
