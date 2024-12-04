import { mysqlTable, primaryKey, int, varchar, unique, char } from "drizzle-orm/mysql-core";

export const Accounts = mysqlTable(
	"accounts",
	{
		id: int().autoincrement().notNull().primaryKey(),
		name: varchar({ length: 32 }).notNull(),
		password: char({ length: 40 }).notNull(),
		recKey: varchar("rec_key", { length: 255 }),
		secret: char({ length: 16 }),
		type: int().default(1).notNull(),
		coins: int().default(0).notNull(),
		premiumEndsAt: int("premium_ends_at", { unsigned: true }).default(0).notNull(),
		email: varchar({ length: 255 }).notNull(),
		creation: int().default(0).notNull(),
	},
	(table) => {
		return {
			accountsId: primaryKey({ columns: [table.id], name: "accounts_id" }),
			accountsEmailKey: unique("accounts_email_key").on(table.email),
			accountsRecKeyKey: unique("accounts_rec_key_key").on(table.recKey),
			name: unique("name").on(table.name),
		};
	},
);
