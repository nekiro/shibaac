import { Flex, FlexProps } from "@chakra-ui/react";

export interface ContentBodyProps extends FlexProps {}

export const ContentBody = ({ children, ...props }: ContentBodyProps) => {
	return (
		<Flex alignSelf="center" direction="column" columnGap="2em" width="100%" maxW="30rem" {...props}>
			{children}
		</Flex>
	);
};
