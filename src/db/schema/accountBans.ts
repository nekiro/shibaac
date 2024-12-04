import { mysqlTable, index, primaryKey, int, varchar, bigint } from "drizzle-orm/mysql-core";

import { Accounts } from "./accounts";
import { Players } from "./players";

export const accountBans = mysqlTable(
	"account_bans",
	{
		accountId: int("account_id")
			.notNull()
			.references(() => Accounts.id, { onDelete: "cascade", onUpdate: "cascade" }),
		reason: varchar({ length: 255 }).notNull(),
		bannedAt: bigint("banned_at", { mode: "number" }).notNull(),
		expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
		bannedBy: int("banned_by")
			.notNull()
			.references(() => Players.id, { onDelete: "cascade", onUpdate: "cascade" }),
	},
	(table) => {
		return {
			bannedBy: index("banned_by").on(table.bannedBy),
			accountBansAccountId: primaryKey({ columns: [table.accountId], name: "account_bans_account_id" }),
		};
	},
);
