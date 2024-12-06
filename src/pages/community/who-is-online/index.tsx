import Panel from "@component/Panel";
import StrippedTable from "@component/StrippedTable";
import Head from "@layout/Head";
import Label from "@component/Label";
import { trpc } from "@util/trpc";
import { VStack } from "@chakra-ui/react";
import { getVocationNameById } from "@shared/enums/Vocation";

export default function WhoIsOnline() {
	const players = trpc.player.online.useQuery();
	const status = trpc.status.status.useQuery();

	return (
		<>
			<Head title="Who is online" />
			<Panel header="Who is online">
				<VStack>
					<Label colorScheme="violet" fontSize="sm">
						Overall Maximum: {status.data?.maxOnlineCount ?? 0} players. There are currently {players.data?.length ?? 0} players online on
						{status.data?.name ?? "..."}
					</Label>
					{players.data && (
						<StrippedTable
							isLoading={players.isLoading}
							head={[{ text: "Name" }, { text: "Level" }, { text: "Vocation" }]}
							body={players.data?.map((player) => [
								{ href: `/character/${player.name}`, text: player.name },
								{ text: player.level },
								{ text: getVocationNameById(player.vocation) },
							])}
						/>
					)}
				</VStack>
			</Panel>
		</>
	);
}
