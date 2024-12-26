import React, { PropsWithChildren } from "react";
import Head from "./Head";
import { Text, useBreakpointValue } from "@chakra-ui/react";
import { TopBar } from "./TopBar";
import { MobileTopBar } from "./TopBar/Mobile";
import NextTopLoader from "nextjs-toploader";

const Layout = ({ children }: PropsWithChildren) => {
	const TopBarComponent = useBreakpointValue({ base: MobileTopBar, lg: TopBar });

	return (
		<>
			<Head title="Home" />
			<NextTopLoader color="#c3a6d9" />
			{TopBarComponent && <TopBarComponent />}
			{children}
			<Text userSelect="none" fontSize="sm" position="fixed" color="white" bottom="5" left="50%" transform="translateX(-50%)">
				Copyright © 2021-2025 Shibaac
			</Text>
		</>
	);
};

export default Layout;
