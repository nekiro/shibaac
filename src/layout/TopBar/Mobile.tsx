import { Text, Image, IconButton, HStack, useDisclosure } from "@chakra-ui/react";
import { TopBarItem } from "./TopBarItem";
import Link from "@component/Link";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineClose } from "react-icons/md";
import { DarkModeButton } from "@component/DarkModeButton";
import { NavBar } from "@component/NavBar";
import { MobileMenu } from "@component/MobileMenu";

export const MobileTopBar = () => {
	const { isOpen, onToggle, onClose } = useDisclosure();

	return (
		<>
			<NavBar justifyContent="space-between">
				<Link href="/" style={{ height: "100%", textDecoration: "none" }}>
					<TopBarItem paddingLeft={0} userSelect="none" pointerEvents="none">
						<Image height="35px" src="/images/header.png" alt="shibaac" />
						<Text fontSize="lg" color="white" ml="10px">
							Shibaac
						</Text>
					</TopBarItem>
				</Link>
				<HStack>
					<DarkModeButton aria-label="Toggle Dark Mode" />
					<IconButton
						aria-label="Open Menu"
						icon={isOpen ? <MdOutlineClose /> : <GiHamburgerMenu />}
						color="white"
						variant="outline"
						onClick={onToggle}
					/>
				</HStack>
			</NavBar>
			{isOpen && <MobileMenu onClose={onClose} />}
		</>
	);
};
