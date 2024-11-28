import React from "react";
import { useRouter } from "next/router";
import { Flex, Spacer, Box, Menu, MenuButton, MenuList, MenuItem, MenuGroup, IconButton, Link, useBreakpointValue } from "@chakra-ui/react";
import DropdownButton from "../components/DropdownButton";
import TextInput from "../components/TextInput";
import { RxHamburgerMenu } from "react-icons/rx";
import { trpc } from "@util/trpc";
import { User } from "@lib/session";

const navigationItems = [
	{ text: "Home", href: "/" },
	{
		hasMenu: true,
		menuItems: [
			{ text: "Highscores", url: "/community/highscores" },
			{ text: "Guilds", url: "/community/guilds" },
			{ text: "Houses", url: "/community/houses" },
		],
		text: "Community",
	},
	{
		hasMenu: true,
		menuItems: [
			{ text: "Server Information", url: "/serverinfo" },
			{ text: "Downloads", url: "/downloads" },
		],
		text: "Library",
	},
	{ text: "Donate", href: "/donate" },
	{ text: "Store", href: "/shop" },
];

interface MobileNavigationProps {
	user?: User;
}

const MobileNavigation = ({ user }: MobileNavigationProps) => {
	return (
		<Flex bgColor="violet.400" height="fit-content" marginBottom="1.5em" flexDir="row" borderRadius="md">
			<Menu>
				<MenuButton
					as={IconButton}
					aria-label="Menu"
					icon={<RxHamburgerMenu />}
					variant="outline"
					_hover={{}}
					color={"white"}
					_active={{ bgColor: "white", color: "black" }}
					alignSelf={"center"}
					marginLeft={1}
				/>
				<MenuList>
					{navigationItems.map((item) => {
						return item.hasMenu ? (
							<MenuGroup key={item.text} title={item.text}>
								{item.menuItems.map((subItem) => {
									return <MenuItem key={subItem.text}>{subItem.text}</MenuItem>;
								})}
							</MenuGroup>
						) : (
							<MenuItem key={item.text} as={Link} href={item.href}>
								{item.text}
							</MenuItem>
						);
					})}
				</MenuList>
			</Menu>

			<Spacer />
			{user ? (
				<DropdownButton
					text={user.name}
					hasMenu={true}
					list={[
						{ text: "Account Management", url: "/account" },
						{ text: "Sign out", url: "/account/logout" },
					]}
				/>
			) : (
				<>
					<DropdownButton text="Sign Up" href="/account/register" />
					<DropdownButton text="Sign In" href="/account/login" />
				</>
			)}
		</Flex>
	);
};

interface DesktopNavigationProps {
	user: any;
}

const DesktopNavigation = ({ user }: DesktopNavigationProps) => {
	const router = useRouter();

	return (
		<Flex bgColor="violet.400" height="fit-content" marginBottom="1.5em" flexDir="row" borderRadius="md">
			{navigationItems.map((item) => (
				<DropdownButton key={item.text} text={item.text} hasMenu={item.hasMenu} list={item.menuItems} href={item.href} />
			))}

			<Box alignSelf="center">
				<form
					onSubmit={(event) => {
						event.preventDefault();
						const form = event.currentTarget;
						const searchValue = (form.elements.namedItem("search") as any)?.value;
						if (searchValue) {
							router.push(`/character/${searchValue}`);
							form.reset();
						}
					}}
				>
					<TextInput name="search" placeholder="Search character..." />
				</form>
			</Box>

			<Spacer />
			{user ? (
				<DropdownButton
					text={user.name}
					hasMenu={true}
					list={[
						{ text: "Account Management", url: "/account" },
						{ text: "Sign out", url: "/account/logout" },
					]}
				/>
			) : (
				<>
					<DropdownButton text="Sign Up" href="/account/register" />
					<DropdownButton text="Sign In" href="/account/login" />
				</>
			)}
		</Flex>
	);
};

const NavBar = () => {
	const user = trpc.me.me.useQuery().data;

	const NavComponent = useBreakpointValue(
		{
			base: MobileNavigation,
			md: DesktopNavigation,
		},
		{
			fallback: "md",
		},
	);

	if (!NavComponent) return null;

	return <NavComponent user={user?.account} />;
};

export default NavBar;
