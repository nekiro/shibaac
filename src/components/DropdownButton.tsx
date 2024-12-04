import { useRouter } from "next/router";
import { Menu, MenuButton, MenuList, Button, useDisclosure, MenuItem } from "@chakra-ui/react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Link from "next/link";

export interface DropdownButtonProps {
	hasMenu?: boolean;
	text: string;
	href?: string;
	list?: { text: string; url: string; isActive?: boolean }[];
}

const DropdownButton = ({ hasMenu = false, text, href, list }: DropdownButtonProps) => {
	const router = useRouter();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isActive = hasMenu ? list?.some((item) => router.asPath.startsWith(item.url)) : router.asPath === href;

	if (hasMenu) {
		return (
			<Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
				<MenuButton
					color={isActive ? "black" : "white"}
					bg={isActive ? "#c3a6d9" : ""}
					as={Button}
					h="100%"
					borderRadius={0}
					rightIcon={isOpen ? <IoChevronUp size="10px" /> : <IoChevronDown size="10px" />}
					fontWeight={"normal"}
					_hover={{ bgColor: "rgba(255, 255, 255, 0.3)" }}
					_active={{ bgColor: "rgba(255, 255, 255, 0.3)" }}
					_focus={{ outline: 0 }}
				>
					{text}
				</MenuButton>
				<MenuList padding={0}>
					{list?.map((item) => (
						<Link key={item.text} href={item.url} passHref>
							<MenuItem
								borderRadius="sm"
								_hover={{ bgColor: "violet.50" }}
								_focus={{ bgColor: "violet.50" }}
								backgroundColor={item.isActive ? "#c3a6d9" : ""}
							>
								{item.text}
							</MenuItem>
						</Link>
					))}
				</MenuList>
			</Menu>
		);
	}

	return (
		<Link href={href ?? "#"} style={{ height: "100%" }} passHref>
			<Button
				h="100%"
				color={isActive ? "black" : "white"}
				bg={isActive ? "#c3a6d9" : ""}
				borderRadius={0}
				fontWeight="normal"
				_hover={{ bgColor: "rgba(255, 255, 255, 0.3)" }}
				_active={{ bgColor: "rgba(255, 255, 255, 0.3)" }}
				_focus={{ outline: 0 }}
			>
				{text}
			</Button>
		</Link>
	);
};

export default DropdownButton;
