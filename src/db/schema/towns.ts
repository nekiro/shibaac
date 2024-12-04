import { mysqlTable, primaryKey, int, varchar, unique } from "drizzle-orm/mysql-core";

export const Towns = mysqlTable(
	"towns",
	{
		id: int().autoincrement().notNull(),
		name: varchar({ length: 255 }).notNull(),
		posx: int().default(0).notNull(),
		posy: int().default(0).notNull(),
		posz: int().default(0).notNull(),
	},
	(table) => {
		return {
			townsId: primaryKey({ columns: [table.id], name: "towns_id" }),
			name: unique("name").on(table.name),
		};
	},
);
