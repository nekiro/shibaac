import { mysqlTable, primaryKey, int, varchar, bigint, tinyint } from "drizzle-orm/mysql-core";
import { Players } from "./players";

export const PlayerDeaths = mysqlTable(
	"player_deaths",
	{
		playerId: int("player_id")
			.notNull()
			.references(() => Players.id, { onDelete: "restrict", onUpdate: "cascade" }),
		time: bigint({ mode: "number" }).notNull(),
		level: int().default(1).notNull(),
		killedBy: varchar("killed_by", { length: 255 }).notNull(),
		isPlayer: tinyint("is_player").default(1).notNull(),
		mostdamageBy: varchar("mostdamage_by", { length: 100 }).notNull(),
		mostdamageIsPlayer: tinyint("mostdamage_is_player").default(0).notNull(),
		unjustified: tinyint().default(0).notNull(),
		mostdamageUnjustified: tinyint("mostdamage_unjustified").default(0).notNull(),
	},
	(table) => {
		return {
			playerDeathsPlayerId: primaryKey({ columns: [table.playerId], name: "player_deaths_player_id" }),
		};
	},
);
