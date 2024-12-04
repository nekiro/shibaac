import { Box, BoxProps } from "@chakra-ui/react";

interface TopBarSeparatorProps extends BoxProps {}

export const TopBarSeparator = ({ ...props }: TopBarSeparatorProps) => {
	return <Box bgColor="violet.400" w="1px" h="100%" {...props} />;
};
