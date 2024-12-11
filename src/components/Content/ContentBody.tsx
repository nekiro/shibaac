import { Flex, FlexProps } from "@chakra-ui/react";

export interface ContentBodyProps extends FlexProps {}

export const ContentBody = ({ children, ...props }: ContentBodyProps) => {
	return (
		<Flex alignItems="center" direction="column" columnGap="2em" {...props}>
			{children}
		</Flex>
	);
};
