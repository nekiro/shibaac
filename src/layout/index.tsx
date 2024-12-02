import React, { PropsWithChildren } from "react";
import Head from "./Head";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Footer from "./Footer";
import { Box, Image, Flex } from "@chakra-ui/react";
import { TopBar } from "./TopBar";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<TopBar />
			<Head title="Home" />
			<Box w={{ base: "95%", md: "95%", xl: "65%", "2xl": "35%" }} marginX={"auto"} marginY={{ base: "1em", md: 0 }}>
				<Image width="230px" marginLeft="auto" marginRight="auto" marginBottom="15px" marginTop="15px" src="/images/header.png" alt="shibaac" />
				<NavBar />
				<Flex flexDirection={{ base: "column", md: "row" }}>
					<Flex flexDir="column" flexGrow="1" marginRight={{ base: 0, md: "3em" }} order={{ base: 2, md: 1 }}>
						{children}
						<Footer />
					</Flex>
					<SideBar order={{ base: 1, md: 2 }} />
				</Flex>
			</Box>
		</>
	);
};

export default Layout;
