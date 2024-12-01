import { Flex, Text } from "@chakra-ui/react";
import { TopBarItem } from "./TopBarItem";
import { trpc } from "@util/trpc";
import Link from "@component/Link";
import { TopBarSeparator } from "./TopBarSeparator";
import { FaDiscord } from "react-icons/fa";
import { TbBrandYoutubeFilled } from "react-icons/tb";
import { FaGithub } from "react-icons/fa";

export const TopBar = () => {
	const status = trpc.status.status.useQuery().data;

	return (
		<Flex justifyContent="center" bgColor="blackAlpha.600" h="40px" borderBottomWidth="1px" borderColor="violet.400">
			<Flex alignItems="center" flexDir="row" gap="5px">
				<TopBarSeparator />
				<Link href="/online">
					<TopBarItem flexDirection="row">
						<Text fontSize="md" color={status?.online ? "green" : "red"}>
							{status?.onlineCount ?? "..."}
						</Text>
						<Text fontSize="md" ml="5px" color="white">
							players online
						</Text>
					</TopBarItem>
				</Link>
				<TopBarSeparator />
				<Link href="/downloads" color="white">
					<TopBarItem>
						<Text fontSize="md">Download Client</Text>
					</TopBarItem>
				</Link>

				<TopBarSeparator />
				<TopBarItem>
					<Flex alignItems="center" gap="10px" flexDirection="row">
						<Link href={process.env.NEXT_PUBLIC_GITHUB_URL ?? ""} isExternal color="white">
							<FaGithub size="25px" />
						</Link>
						<Link href={process.env.NEXT_PUBLIC_DISCORD_URL ?? ""} isExternal color="white">
							<FaDiscord size="25px" />
						</Link>
						<Link href={process.env.NEXT_PUBLIC_YOUTUBE_URL ?? ""} isExternal color="white">
							<TbBrandYoutubeFilled size="25px" />
						</Link>
					</Flex>
				</TopBarItem>
				<TopBarSeparator />
			</Flex>
		</Flex>
	);
};
