import React from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import { trpc } from "@util/trpc";
import { DesktopNavigation } from "./DesktopNavBar";
import { MobileNavigation } from "./MobileNavBar";

export interface NavigationItems {
	text: string;
	href?: string;
	hasMenu?: boolean;
	menuItems?: { text: string; url: string }[];
}

const navigationItems: NavigationItems[] = [
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

	return <NavComponent user={user?.account} navigationItems={navigationItems} />;
};

export default NavBar;
