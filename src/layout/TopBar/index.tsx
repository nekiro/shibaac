import { Flex, Text } from "@chakra-ui/react";
import { TopBarItem } from "./TopBarItem";
import { trpc } from "@util/trpc";

export const TopBar = () => {
	const status = trpc.status.status.useQuery().data;

	return (
		<Flex justifyContent="center" bgColor="blackAlpha.600" h="40px" borderBottomWidth="1px" borderColor="violet.400">
			<Flex alignItems="center" flexDir="row" gap="5px">
				<TopBarItem alignItems="center" flexDirection="row">
					<Text fontSize="md" color={status?.online ? "green" : "red"}>
						{status?.onlineCount ?? "..."}
					</Text>
					<Text fontSize="md" ml="5px" color="white">
						players online
					</Text>
				</TopBarItem>
			</Flex>
		</Flex>
	);
};
