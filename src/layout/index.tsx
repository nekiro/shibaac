import React, { PropsWithChildren } from "react";
import Head from "./Head";
import SideBar from "./SideBar";
import { Flex, VStack, Text } from "@chakra-ui/react";
import { TopBar } from "./TopBar";
import { useColors } from "@hook/useColors";

const Layout = ({ children }: PropsWithChildren) => {
	const { bgColor } = useColors();

	return (
		<>
			<Head title="News" />
			<TopBar />
			<Flex
				w={{ lg: "1050px", base: "100%" }}
				bgColor={bgColor}
				mt="2em"
				marginX={"auto"}
				padding="1em"
				flexDirection={{ base: "column", md: "row" }}
				gap={{ base: "1em", md: 0 }}
			>
				<VStack flexGrow="1" marginRight={{ base: 0, md: "2em" }} order={{ base: 2, md: 1 }}>
					{children}
				</VStack>
				<SideBar order={{ base: 1, md: 2 }} />
			</Flex>
			<Text userSelect="none" fontSize="sm" position="absolute" color="white" bottom="5" left="50%" transform="translateX(-50%)">
				Copyright © 2021-2025 Shibaac
			</Text>
		</>
	);
};

export default Layout;
