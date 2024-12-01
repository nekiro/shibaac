import { BoxProps, Flex } from "@chakra-ui/react";

export interface TopBarItemProps extends BoxProps {
	children?: React.ReactNode;
}

export const TopBarItem = ({ children, ...props }: TopBarItemProps) => {
	return (
		<Flex borderLeftWidth="1px" borderRightWidth="1px" borderColor="violet.400" paddingRight="15px" paddingLeft="15px" h="100%" {...props}>
			{children}
		</Flex>
	);
};
