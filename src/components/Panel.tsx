import React, { ReactNode } from "react";
import Loader from "./Loader";
import { Flex, Box, Text, Grid, FlexProps } from "@chakra-ui/react";
import { useColors } from "@hook/useColors";

export interface PanelProps extends FlexProps {
	header?: string;
	identifier?: string | null;
	children?: ReactNode;
	isLoading?: boolean;
}

const Panel = ({ header, identifier, children, isLoading = false, borderRadius = "none", padding = "10px", ...props }: PanelProps) => {
	const { bgColor, textColor } = useColors();

	return (
		<Flex
			key={identifier}
			width="100%"
			flexDirection="column"
			color={textColor}
			border="1px"
			borderColor="#ddd"
			bgColor={bgColor}
			textAlign="center"
			borderRadius={borderRadius}
			borderBottomRadius={0}
			{...props}
		>
			{header && (
				<Flex color="black" borderRadius={borderRadius}>
					<Grid marginBottom="10px" width="100%" templateColumns="1fr auto">
						<Text color={textColor}>{header}</Text>
					</Grid>
				</Flex>
			)}
			<Box padding={padding}>{isLoading ? <Loader /> : children}</Box>
		</Flex>
	);
};

export default Panel;
