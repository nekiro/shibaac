import { mysqlTable, primaryKey, int, varchar, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { Accounts } from "./accounts";

export const News = mysqlTable(
	"aac_news",
	{
		id: int().autoincrement().notNull(),
		title: varchar({ length: 255 }).notNull(),
		content: varchar({ length: 255 }).notNull(),
		authorId: int().references(() => Accounts.id, { onDelete: "set null" }),
		createdAt: datetime({ mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		imageUrl: varchar({ length: 255 }),
		playerNick: varchar({ length: 255 }),
	},
	(table) => {
		return {
			aacNewsId: primaryKey({ columns: [table.id], name: "aac_news_id" }),
		};
	},
);
