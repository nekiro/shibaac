import React from "react";
import Panel from "src/components/Panel";
import { timestampToDate, vocationIdToName, groupToName, secondsToTime } from "src/lib";
import { useRouter } from "next/router";
import StrippedTable from "src/components/StrippedTable";
import Label from "src/components/Label";
import { trpc } from "../../utils/trpc";

export default function Character() {
	const router = useRouter();
	const { name } = router.query;

	const player = trpc.player.singleByName.useQuery({ name: String(name) });
	const townId = player.data?.town_id;
	const town = trpc.town.singleById.useQuery(
		{ id: townId as number },
		{
			enabled: !!townId,
		},
	);

	if (!player.isFetched || !town.isFetched) {
		return <Panel header="Character Information" isLoading={true} />;
	}

	if (!player.data) {
		return (
			<Panel header="Character Info">
				<Label colorScheme="red">Character not found.</Label>
			</Panel>
		);
	}

	const lastLoginDate = player.data.lastlogin > 0 ? timestampToDate(player.data.lastlogin) : "Never logged in";
	const isPremium = player.data.accounts.premium_ends_at >= Date.now();

	return (
		<>
			<Panel header="Character Information">
				<StrippedTable
					body={[
						[{ text: "Name" }, { text: player.data.name }],
						[{ text: "Level" }, { text: player.data.level }],
						[{ text: "Sex" }, { text: player.data.sex == 1 ? "Male" : "Female" }],
						[{ text: "Profession" }, { text: vocationIdToName[player.data.vocation] }],
						...(town.data ? [[{ text: "Town" }, { text: town.data.name }]] : []),
						// ...(player.data.guilds.length > 0
						// 	? [
						// 			{
						// 				text: "Guild",
						// 			},
						// 			{
						// 				text: player.data.guilds[0].name,
						// 			},
						// 		]
						// 	: []),
						[{ text: "Last Login" }, { text: lastLoginDate }],
						// [
						// 	{ text: "Online Time" },
						// 	{
						// 		text: player.data.onlinetime > 0 ? secondsToTime(player.data.onlinetime) : "Never logged in",
						// 	},
						// ],
					]}
				/>
			</Panel>

			<Panel header="Account Information">
				<StrippedTable
					body={[
						...(player.data.group_id > 1 ? [[{ text: "Position" }, { text: groupToName[player.data.group_id] }]] : []),
						// [
						// 	{ text: "Created" },
						// 	{
						// 		text: player.data.creation > 0 ? timestampToDate(player.data.creation) : "Unknown",
						// 	},
						// ],
						[
							{ text: "Account Status" },
							{
								text: `${isPremium ? "Premium" : "Free"} Account`,
							},
						],
					]}
				/>
			</Panel>

			{player.data.player_deaths.length > 0 && (
				<Panel header="Deaths">
					<StrippedTable
						head={[{ text: "Date" }, { text: "Message" }]}
						body={player.data.player_deaths.map((death) => [
							{ text: timestampToDate(death.time) },
							{ text: `Died at level ${death.level} by ${death.killed_by}` },
						])}
					/>
				</Panel>
			)}

			{/* <span className="label label-danger">Deleted</span>  */}

			<Panel header="Characters">
				<StrippedTable
					head={[{ text: "Name" }, { text: "Level" }, { text: "Profession" }, { text: "Status" }]}
					body={player.data.accounts.players.map((player) => [
						{ href: `/character/${player.name}`, text: player.name },
						{ text: player.level },
						{ text: vocationIdToName[player.vocation] },
						// { text: player.players_online ? "Online" : "Offline" },
					])}
				/>
			</Panel>
		</>
	);
}
