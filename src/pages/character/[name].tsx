import React from "react";
import Panel from "src/components/Panel";
import { timestampToDate, vocationIdToName, groupToName, secondsToTime } from "src/lib";
import { useRouter } from "next/router";
import StrippedTable from "src/components/StrippedTable";
import Label from "src/components/Label";
import { trpc } from "../../utils/trpc";
import { Content } from "@component/Content";
import Loader from "@component/Loader";

// TODO: refactor this view, because its really ugly

export default function Character() {
	const router = useRouter();
	const { name } = router.query;

	const characterData = trpc.player.singleByName.useQuery({ name: String(name) });

	if (characterData.isLoading) {
		return (
			<Content>
				<Content.Header>Character</Content.Header>
				<Content.Body>
					<Loader />
				</Content.Body>
			</Content>
		);
	}

	if (characterData.error) {
		return (
			<Content>
				<Content.Header>Character</Content.Header>
				<Content.Body>
					<Label colorScheme="red">{characterData.error.message}</Label>
				</Content.Body>
			</Content>
		);
	}

	const playerData = characterData.data.player;
	const townData = characterData.data.town;

	const lastLoginDate = playerData.lastlogin > 0 ? timestampToDate(playerData.lastlogin) : "Never logged in";
	const isPremium = playerData.accounts.premium_ends_at >= Date.now();

	return (
		<Content>
			<Content.Header>Character</Content.Header>
			<Content.Body maxW="100%">
				<Panel header="Character Information">
					<StrippedTable
						body={[
							[{ text: "Name" }, { text: playerData.name }],
							[{ text: "Level" }, { text: playerData.level }],
							[{ text: "Sex" }, { text: playerData.sex == 1 ? "Male" : "Female" }],
							[{ text: "Profession" }, { text: vocationIdToName[playerData.vocation] }],
							...(townData ? [[{ text: "Town" }, { text: townData.name }]] : []),
							// ...(playerData.guilds.length > 0
							// 	? [
							// 			{
							// 				text: "Guild",
							// 			},
							// 			{
							// 				text: playerData.guilds[0].name,
							// 			},
							// 		]
							// 	: []),
							[{ text: "Last Login" }, { text: lastLoginDate }],
							// [
							// 	{ text: "Online Time" },
							// 	{
							// 		text: playerData.onlinetime > 0 ? secondsToTime(playerData.onlinetime) : "Never logged in",
							// 	},
							// ],
						]}
					/>
				</Panel>

				<Panel header="Account Information">
					<StrippedTable
						body={[
							...(playerData.group_id > 1 ? [[{ text: "Position" }, { text: groupToName[playerData.group_id] }]] : []),
							// [
							// 	{ text: "Created" },
							// 	{
							// 		text: playerData.creation > 0 ? timestampToDate(playerData.creation) : "Unknown",
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

				{playerData.player_deaths.length > 0 && (
					<Panel header="Deaths">
						<StrippedTable
							head={[{ text: "Date" }, { text: "Message" }]}
							body={playerData.player_deaths.map((death) => [
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
						body={playerData.accounts.players.map((player) => [
							{ href: `/character/${player.name}`, text: player.name },
							{ text: player.level },
							{ text: vocationIdToName[player.vocation] },
							// { text: player.players_online ? "Online" : "Offline" },
						])}
					/>
				</Panel>
			</Content.Body>
		</Content>
	);
}
