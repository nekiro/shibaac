import { Flex, FlexProps } from "@chakra-ui/react";

export interface NavBarProps extends FlexProps {}

export const NavBar = ({ children, ...props }: NavBarProps) => {
	return (
		<Flex
			as="nav"
			justifyContent="center"
			h="50px"
			position="sticky"
			top="0"
			w="100%"
			paddingLeft="15px"
			paddingRight="15px"
			borderBottomWidth="1px"
			borderColor="violet.400"
			_before={{
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				bgGradient: "bg-gradient",
				filter: "brightness(0.6)",
				zIndex: -1,
			}}
			{...props}
		>
			{children}
		</Flex>
	);
};
