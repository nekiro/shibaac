import React, { PropsWithChildren } from "react";
import Head from "./Head";
import { Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { TopBar } from "./TopBar";
import { useColors } from "@hook/useColors";
import { MobileTopBar } from "./TopBar/Mobile";
import NextTopLoader from "nextjs-toploader";

const Layout = ({ children }: PropsWithChildren) => {
	const { bgColor } = useColors();
	const TopBarComponent = useBreakpointValue({ base: MobileTopBar, lg: TopBar });

	return (
		<>
			<Head title="News" />
			<NextTopLoader color="#c3a6d9" />
			{TopBarComponent && <TopBarComponent />}
			<Flex as="main" w={{ lg: "1050px", base: "100%" }} bgColor={bgColor} mt="2em" marginX={"auto"} padding="1em" rounded="md">
				{children}
			</Flex>
			<Text userSelect="none" fontSize="sm" position="fixed" color="white" bottom="5" left="50%" transform="translateX(-50%)">
				Copyright © 2021-2025 Shibaac
			</Text>
		</>
	);
};

export default Layout;
