import { Text, Image, HStack, Spacer } from "@chakra-ui/react";
import { TopBarItem } from "./TopBarItem";
import { trpc } from "@util/trpc";
import Link from "@component/Link";
import { TopBarSeparator } from "./TopBarSeparator";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { TbBrandYoutubeFilled } from "react-icons/tb";
import DropdownButton from "@component/DropdownButton";
import { useRouter } from "next/router";
import { DarkModeButton } from "@component/DarkModeButton";
import { NavBar } from "@component/NavBar";
import { IoIosSearch } from "react-icons/io";

export interface NavigationItems {
	text: string;
	href?: string;
	hasMenu?: boolean;
	menuItems?: { text: string; url: string }[];
}
export const navigationItems: NavigationItems[] = [
	{ text: "Home", href: "/" },
	{
		hasMenu: true,
		menuItems: [
			{ text: "Highscores", url: "/community/highscores" },
			{ text: "Search Character", url: "/community/character" },
			{ text: "Who is online", url: "/community/who-is-online" },
			// { text: "Guilds", url: "/community/guilds" },
			// { text: "Houses", url: "/community/houses" },
		],
		text: "Community",
	},
	{
		hasMenu: true,
		menuItems: [{ text: "Server Information", url: "/library/server-info" }],
		text: "Library",
	},

	// { text: "Donate", href: "/donate" },
	// { text: "Store", href: "/shop" },
];

export const TopBar = () => {
	const account = trpc.me.me.useQuery().data;
	const status = trpc.status.status.useQuery().data;

	return (
		<NavBar justifyContent="flex-start" paddingX="14em">
			<HStack>
				<Link href="/" style={{ height: "100%", textDecoration: "none" }}>
					<TopBarItem paddingLeft={0} userSelect="none" pointerEvents="none">
						<Image height="35px" boxSize="35px" src="/images/header.png" alt="shibaac" />
						<Text fontSize="lg" color="white" ml="10px">
							Shibaac
						</Text>
					</TopBarItem>
				</Link>
				<DarkModeButton aria-label="Toggle Dark Mode" />
				<Link href="/character" title="Search Character" color="white" _hover={{ color: "violet.300" }}>
					<IoIosSearch size="25px" />
				</Link>
			</HStack>
			<Spacer />
			<HStack gap={0} height="50px">
				{navigationItems.map((item) => (
					<TopBarItem key={item.text} padding={0}>
						<DropdownButton text={item.text} hasMenu={item.hasMenu} list={item.menuItems} href={item.href} />
					</TopBarItem>
				))}
				<TopBarItem padding={0}>
					{account ? (
						<DropdownButton
							text={account.account?.name ?? "unknown"}
							hasMenu={true}
							list={[
								{ text: "Account Management", url: "/account" },
								{ text: "Sign out", url: "/account/logout" },
							]}
						/>
					) : (
						<DropdownButton
							text="Account"
							hasMenu={true}
							list={[
								{ text: "Login", url: "/account/login" },
								{ text: "Register", url: "/account/register" },
							]}
						/>
					)}
				</TopBarItem>
				<Spacer w="2em" />
			</HStack>
			<Spacer />
			<TopBarItem padding={0}>
				<HStack alignItems="center" gap="10px">
					{/* TODO: move to component */}
					<Link href={process.env.NEXT_PUBLIC_GITHUB_URL ?? ""} title="Github" isExternal color="white" _hover={{ color: "violet.300" }}>
						<FaGithub size="25px" />
					</Link>
					<Link href={process.env.NEXT_PUBLIC_DISCORD_URL ?? ""} title="Discord" isExternal color="white" _hover={{ color: "#5865F2" }}>
						<FaDiscord size="25px" />
					</Link>
					<Link href={process.env.NEXT_PUBLIC_YOUTUBE_URL ?? ""} title="Youtube" isExternal color="white" _hover={{ color: "red" }}>
						<TbBrandYoutubeFilled size="25px" />
					</Link>
				</HStack>
			</TopBarItem>
			<TopBarSeparator ml="10px" height="80%" alignSelf="center" />
			<Link href="/community/who-is-online">
				<TopBarItem paddingLeft="10px" flexDirection="row">
					<Text fontSize="sm" color="white">
						{status?.onlineCount ?? "..."} players online
					</Text>
				</TopBarItem>
			</Link>
		</NavBar>
	);
};
