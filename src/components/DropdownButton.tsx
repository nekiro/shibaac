import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { IoChevronDown } from "react-icons/io5";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";

export interface DropdownButtonProps {
	hasMenu?: boolean;
	text: string;
	href?: string;
	list?: { text: string; url: string; isActive?: boolean }[];
}

const DropdownButton = ({ hasMenu = false, text, href, list }: DropdownButtonProps) => {
	const router = useRouter();
	const isActive = hasMenu ? list?.some((item) => router.asPath.startsWith(item.url)) : router.asPath === href;

	if (hasMenu) {
		return (
			<Menu>
				<MenuButton
					color="white"
					bg={isActive ? "#c3a6d9)" : "transparent"}
					as={Button}
					pt="25px"
					pb="25px"
					rightIcon={<IoChevronDown />}
					fontWeight="normal"
					_hover={{ bgColor: "rgba(255, 255, 255, 0.3)" }}
					_active={{ bgColor: " rgba(255, 255, 255, 0.3)" }}
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
	} else if (href) {
		return (
			<Link href={href} passHref>
				<Button
					color="white"
					bg={isActive ? "#c3a6d9" : "transparent"}
					pt="25px"
					pb="25px"
					fontWeight="normal"
					_hover={{ bgColor: "rgba(255, 255, 255, 0.3)" }}
					_active={{ bgColor: " rgba(255, 255, 255, 0.3)" }}
					_focus={{ outline: "0" }}
					alignSelf="self-end"
				>
					{text}
				</Button>
			</Link>
		);
	}
};

export default DropdownButton;
