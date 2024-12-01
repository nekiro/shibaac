import React, { ReactNode } from "react";
import Loader from "./Loader";
import { Flex, Box, Text, Grid, FlexProps } from "@chakra-ui/react";
import { IoMdTime } from "react-icons/io";
import { formatDate } from "@lib/.";

export interface PanelProps extends FlexProps {
	header?: string;
	date?: string | null;
	identifier?: string | null;
	children?: ReactNode;
	isLoading?: boolean;
}

const Panel = ({
	header = "Loading...",
	date,
	identifier,
	children,
	isLoading = false,
	borderRadius = "md",
	padding = "10px",
	...props
}: PanelProps) => {
	return (
		<Flex
			key={identifier}
			width="100%"
			flexDirection="column"
			color="black"
			border="1px"
			borderColor="#ddd"
			bgColor="#fff"
			borderRadius={borderRadius}
			borderBottomRadius={0}
			{...props}
		>
			<Flex bg="#f5f5f5" border="1px" borderColor="#ddd" borderRadius={borderRadius}>
				<Grid margin="10px" width="100%" templateColumns="1fr auto">
					<Text>{header}</Text>
					{date && (
						<Box display="flex" justifyContent="flex-end">
							<Text display="flex" alignItems="center">
								<IoMdTime /> {formatDate(date)}
							</Text>
						</Box>
					)}
				</Grid>
			</Flex>
			<Box padding={padding}>{isLoading ? <Loader /> : children}</Box>
		</Flex>
	);
};

export default Panel;
