import React from "react";
import { Tag, Box, TagProps } from "@chakra-ui/react";

export interface LabelProps extends TagProps {
	colorScheme?: string;
	fontSize?: string;
	margin?: string;
}

const Label = ({
	colorScheme = "violet",
	fontSize = "md",
	margin = "4px",
	children,
}: LabelProps) => {
	return (
		<Tag variant="solid" colorScheme={colorScheme}>
			<Box fontSize={fontSize} margin={margin}>
				{children}
			</Box>
		</Tag>
	);
};

export default Label;
