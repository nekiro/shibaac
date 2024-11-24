import React, { useEffect, useState, useCallback } from "react";
import Panel from "../components/Panel";
import StrippedTable from "../components/StrippedTable";
import Head from "../layout/Head";
import { fetchApi } from "../lib/request";
import { vocationIdToName } from "../lib";
import Label from "../components/Label";
import { trpc } from "@util/trpc";

export default function Online() {
	const [state, setState] = useState<any>(null);
	const players = trpc.player.online.useQuery();

	const fetchData = useCallback(async () => {
		const status = await fetchApi("GET", `/api/status`);

		if (status.success) {
			setState({
				status: status.status,
			});
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (!state) {
		return <Panel header="Online List" isLoading={true} />;
	}

	return (
		<>
			<Head title="Online" />
			<Panel header="Online List">
				<Label colorScheme="violet" fontSize="sm">
					Overall Maximum: {state.status ? state.status.maxOnlineCount : "0"} players. There are currently {players.data ? players.data.length : 0}{" "}
					players online on {state.status ? state.status.name : "..."}
				</Label>

				{/* <Label colorScheme="violet" fontSize="sm">
          There are currently {state.players ? state.players.length : 0} players
          online on {state.status ? state.status.name : '...'}
        </Label> */}
				{state.players?.length > 0 && (
					<StrippedTable
						head={[{ text: "Name" }, { text: "Level" }, { text: "Vocation" }]}
						body={players.data?.map((player) => [
							{ href: `/character/${player.name}`, text: player.name },
							{ text: player.level },
							{ text: vocationIdToName[player.vocation] },
						])}
					/>
				)}
			</Panel>
		</>
	);
}
