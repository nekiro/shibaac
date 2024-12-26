import Head from "@layout/Head";
import Label from "@component/Label";
import { trpc } from "@util/trpc";
import { Table, TableContainer, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import { getVocationNameById } from "@shared/enums/Vocation";
import { Content } from "@component/Content";

export default function WhoIsOnline() {
	const players = trpc.player.online.useQuery();
	const status = trpc.status.status.useQuery();
	const onlinePlayers = players.data;

	return (
		<>
			<Head title="Who is online" />
			<Content>
				<Content.Header>Who Is Online</Content.Header>
				<Content.Body w="100%" gap={5}>
					<Label colorScheme="violet" fontSize="sm">
						Overall Maximum: {status.data?.maxOnlineCount ?? 0} players. There are currently {onlinePlayers?.length ?? 0} players online on{" "}
						{status.data?.name ? status.data.name : "unknown"}
					</Label>
					{onlinePlayers && (
						<TableContainer>
							<Table variant="striped" colorScheme="purple">
								<Thead>
									<Tr>
										<Th>Name</Th>
										<Th isNumeric>Level</Th>
										<Th>Vocation</Th>
									</Tr>
								</Thead>
								<Tbody>
									{onlinePlayers?.map((player) => (
										<Tr key={player.name}>
											<Td>{player.name}</Td>
											<Td isNumeric>{player.level}</Td>
											<Td>{getVocationNameById(player.vocation)}</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					)}
				</Content.Body>
			</Content>
		</>
	);
}
