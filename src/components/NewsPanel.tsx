import React, { ReactNode } from "react";
import Loader from "./Loader";
import { Flex, Box, Text, Grid, FlexProps } from "@chakra-ui/react";
import { IoMdTime } from "react-icons/io";
import { formatDate } from "@lib/.";
import { HiNewspaper } from "react-icons/hi2";
import { useColors } from "@hook/useColors";

export interface NewsPanelProps extends FlexProps {
	header?: string;
	date?: string | null;
	identifier?: string | null;
	children?: ReactNode;
	isLoading?: boolean;
}

const NewsPanel = ({ header = "Loading...", date, identifier, children, isLoading = false, borderRadius = "none", ...props }: NewsPanelProps) => {
	const { bgColor, textColor } = useColors();

	return (
		<Flex key={identifier} width="100%" flexDirection="column" color={textColor} bgColor={bgColor} borderRadius={borderRadius} {...props}>
			<Flex bgColor={bgColor} borderBottomWidth="1px" borderTopWidth="1px" borderColor="#ddd" borderRadius={borderRadius}>
				<Grid margin="10px" width="100%" templateColumns="1fr auto">
					<Flex flexDirection="row" alignItems="center" gap="5px">
						<HiNewspaper />
						<Text color={textColor}>{header}</Text>
					</Flex>
					{date && (
						<Box display="flex" alignItems="center" justifyContent="flex-end">
							<IoMdTime />
							<Text>{formatDate(date)}</Text>
						</Box>
					)}
				</Grid>
			</Flex>
			<Box padding="10px">{isLoading ? <Loader /> : children}</Box>
		</Flex>
	);
};

export default NewsPanel;
