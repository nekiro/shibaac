import React from "react";
import Head from "./Head";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Footer from "./Footer";
import { Box, Image, Flex } from "@chakra-ui/react";

const Layout = ({ children }) => {
	return (
		<Box w={{ base: "95%", md: "70%" }} marginX={"auto"} marginY={{ base: "1em", md: 0 }}>
			<Head title="layout" />
			<Image width="15%" marginLeft="auto" marginRight="auto" marginBottom="15px" marginTop="15px" src="/images/header.png" alt="shibaac" />
			<NavBar />
			<Flex flexDirection={{ base: "column", md: "row" }}>
				<Box flexGrow="1" marginRight={{ base: 0, md: "3em" }} order={{ base: 2, md: 1 }}>
					{children}
					<Footer />
				</Box>
				<SideBar order={{ base: 1, md: 2 }} />
			</Flex>
		</Box>
	);
};

export default Layout;
