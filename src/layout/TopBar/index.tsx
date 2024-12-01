import { Flex, Text, Box } from "@chakra-ui/react";
import { TopBarItem } from "./TopBarItem";
import { trpc } from "@util/trpc";
import Link from "@component/Link";

export const TopBar = () => {
	const status = trpc.status.status.useQuery().data;

	return (
		<Flex justifyContent="center" bgColor="blackAlpha.600" h="40px" borderBottomWidth="1px" borderColor="violet.400">
			<Flex alignItems="center" flexDir="row" gap="5px">
				<Box bgColor="violet.400" w="1px" h="100%" />
				<Link href="/online">
					<TopBarItem alignItems="center" flexDirection="row">
						<Text fontSize="md" color={status?.online ? "green" : "red"}>
							{status?.onlineCount ?? "..."}
						</Text>
						<Text fontSize="md" ml="5px" color="white">
							players online
						</Text>
					</TopBarItem>
				</Link>

				<Box bgColor="violet.400" w="1px" h="100%" />
			</Flex>
		</Flex>
	);
};
