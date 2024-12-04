import { mysqlTable, primaryKey, int } from "drizzle-orm/mysql-core";
import { Players } from "./players";

export const playersOnline = mysqlTable(
	"players_online",
	{
		playerId: int("player_id")
			.notNull()
			.references(() => Players.id, { onDelete: "restrict", onUpdate: "cascade" }),
	},
	(table) => {
		return {
			playersOnlinePlayerId: primaryKey({ columns: [table.playerId], name: "players_online_player_id" }),
		};
	},
);
