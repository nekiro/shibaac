import React, { ReactNode } from "react";
import Loader from "./Loader";
import { Flex, Box, Text, Grid, FlexProps, useColorModeValue } from "@chakra-ui/react";
import { IoMdTime } from "react-icons/io";
import { formatDate } from "@lib/.";
import { useColors } from "@hook/useColors";

export interface PanelProps extends FlexProps {
	header?: string;
	date?: string | null;
	identifier?: string | null;
	children?: ReactNode;
	isLoading?: boolean;
}

const Panel = ({ header, date, identifier, children, isLoading = false, borderRadius = "none", padding = "10px", ...props }: PanelProps) => {
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
				<Flex border="1px" borderColor="#ddd" color="black" borderRadius={borderRadius}>
					<Grid margin="10px" width="100%" templateColumns="1fr auto">
						<Text color={textColor}>{header}</Text>
						{date && (
							<Box display="flex" justifyContent="flex-end">
								<Text display="flex" alignItems="center">
									<IoMdTime /> {formatDate(date)}
								</Text>
							</Box>
						)}
					</Grid>
				</Flex>
			)}
			<Box padding={padding}>{isLoading ? <Loader /> : children}</Box>
		</Flex>
	);
};

export default Panel;
