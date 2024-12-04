import { mysqlTable, index, primaryKey, int, varchar } from "drizzle-orm/mysql-core";

// export const guildInvites = mysqlTable(
// 	"guild_invites",
// 	{
// 		playerId: int("player_id")
// 			.notNull()
// 			.references(() => players.id, { onDelete: "cascade", onUpdate: "cascade" }),
// 		guildId: int("guild_id")
// 			.notNull()
// 			.references(() => guilds.id, { onDelete: "cascade", onUpdate: "cascade" }),
// 		date: datetime({ mode: "string", fsp: 3 }).notNull(),
// 	},
// 	(table) => {
// 		return {
// 			guildInvitesPlayerId: primaryKey({ columns: [table.playerId], name: "guild_invites_player_id" }),
// 		};
// 	},
// );

// export const guildMembership = mysqlTable(
// 	"guild_membership",
// 	{
// 		playerId: int("player_id")
// 			.notNull()
// 			.references(() => players.id, { onDelete: "cascade", onUpdate: "cascade" }),
// 		guildId: int("guild_id")
// 			.notNull()
// 			.references(() => guilds.id, { onDelete: "cascade", onUpdate: "cascade" }),
// 		rankId: int("rank_id")
// 			.notNull()
// 			.references(() => guildRanks.id, { onDelete: "cascade", onUpdate: "cascade" }),
// 		nick: varchar({ length: 191 }).default("").notNull(),
// 	},
// 	(table) => {
// 		return {
// 			guildMembershipPlayerIdGuildIdKey: unique("guild_membership_player_id_guild_id_key").on(table.playerId, table.guildId),
// 		};
// 	},
// );

// export const guildRanks = mysqlTable(
// 	"guild_ranks",
// 	{
// 		id: int().autoincrement().notNull(),
// 		guildId: int("guild_id")
// 			.notNull()
// 			.references(() => guilds.id, { onDelete: "cascade", onUpdate: "cascade" }),
// 		name: varchar({ length: 191 }).notNull(),
// 		level: int().notNull(),
// 	},
// 	(table) => {
// 		return {
// 			guildRanksId: primaryKey({ columns: [table.id], name: "guild_ranks_id" }),
// 		};
// 	},
// );

// export const guildWars = mysqlTable(
// 	"guild_wars",
// 	{
// 		id: int().autoincrement().notNull(),
// 		guild1: int()
// 			.notNull()
// 			.references(() => guilds.id, { onDelete: "restrict", onUpdate: "cascade" }),
// 		guild2: int()
// 			.notNull()
// 			.references(() => guilds.id, { onDelete: "restrict", onUpdate: "cascade" }),
// 		name1: varchar({ length: 191 }).notNull(),
// 		name2: varchar({ length: 191 }).notNull(),
// 		status: int().default(0).notNull(),
// 		started: bigint({ mode: "number" }).notNull(),
// 		ended: bigint({ mode: "number" }).notNull(),
// 	},
// 	(table) => {
// 		return {
// 			guildWarsId: primaryKey({ columns: [table.id], name: "guild_wars_id" }),
// 		};
// 	},
// );

// export const guilds = mysqlTable(
// 	"guilds",
// 	{
// 		id: int().autoincrement().notNull(),
// 		level: int().default(1).notNull(),
// 		name: varchar({ length: 191 }).notNull(),
// 		ownerid: int()
// 			.notNull()
// 			.references(() => players.id, { onDelete: "cascade", onUpdate: "cascade" }),
// 		creationdata: datetime({ mode: "string", fsp: 3 }).notNull(),
// 		motd: varchar({ length: 191 }).default("").notNull(),
// 		residence: int().default(0).notNull(),
// 		balance: bigint({ mode: "number" }).notNull(),
// 		points: int().default(0).notNull(),
// 		logoUrl: varchar({ length: 191 }),
// 	},
// 	(table) => {
// 		return {
// 			guildsId: primaryKey({ columns: [table.id], name: "guilds_id" }),
// 			guildsNameKey: unique("guilds_name_key").on(table.name),
// 		};
// 	},
// );

// export const guildwarKills = mysqlTable(
// 	"guildwar_kills",
// 	{
// 		id: int().autoincrement().notNull(),
// 		killer: varchar({ length: 191 }).notNull(),
// 		target: varchar({ length: 191 }).notNull(),
// 		killerguild: int().notNull(),
// 		targetguild: int().notNull(),
// 		warid: int()
// 			.notNull()
// 			.references(() => guildWars.id, { onDelete: "cascade", onUpdate: "cascade" }),
// 		time: bigint({ mode: "number" }).notNull(),
// 	},
// 	(table) => {
// 		return {
// 			guildwarKillsId: primaryKey({ columns: [table.id], name: "guildwar_kills_id" }),
// 		};
// 	},
// );

export const houseLists = mysqlTable(
	"house_lists",
	{
		houseId: int("house_id")
			.notNull()
			.references(() => houses.id, { onDelete: "restrict", onUpdate: "cascade" }),
		listid: int().notNull(),
		list: varchar({ length: 191 }).notNull(),
	},
	(table) => {
		return {
			houseId: index("house_id").on(table.houseId),
			houseListsHouseIdListid: primaryKey({ columns: [table.houseId, table.listid], name: "house_lists_house_id_listid" }),
		};
	},
);

export const houses = mysqlTable(
	"houses",
	{
		id: int().autoincrement().notNull(),
		owner: int().notNull(),
		paid: int().default(0).notNull(),
		warnings: int().default(0).notNull(),
		name: varchar({ length: 191 }).notNull(),
		rent: int().default(0).notNull(),
		townId: int("town_id").default(0).notNull(),
		bid: int().default(0).notNull(),
		bidEnd: int("bid_end").default(0).notNull(),
		lastBid: int("last_bid").default(0).notNull(),
		highestBidder: int("highest_bidder").default(0).notNull(),
		size: int().default(0).notNull(),
		guildId: int(),
		beds: int().default(0).notNull(),
	},
	(table) => {
		return {
			owner: index("owner").on(table.owner),
			townId: index("town_id").on(table.townId),
			housesId: primaryKey({ columns: [table.id], name: "houses_id" }),
		};
	},
);

// export const purchases = mysqlTable(
// 	"purchases",
// 	{
// 		id: int().autoincrement().notNull(),
// 		accountId: int()
// 			.notNull()
// 			.references(() => accounts.id, { onDelete: "restrict", onUpdate: "cascade" }),
// 		createdAt: datetime({ mode: "string", fsp: 3 })
// 			.default(sql`(CURRENT_TIMESTAMP(3))`)
// 			.notNull(),
// 		amount: double().notNull(),
// 		status: varchar({ length: 191 }).notNull(),
// 		paymentId: varchar({ length: 191 }),
// 		paymentMethod: varchar({ length: 191 }).notNull(),
// 	},
// 	(table) => {
// 		return {
// 			purchasesId: primaryKey({ columns: [table.id], name: "purchases_id" }),
// 			purchasesPaymentIdKey: unique("purchases_paymentId_key").on(table.paymentId),
// 		};
// 	},
// );

// export const shopOrders = mysqlTable(
// 	"shop_orders",
// 	{
// 		id: int().autoincrement().notNull(),
// 		type: varchar({ length: 191 }).notNull(),
// 		itemid: int().notNull(),
// 		count: int().notNull(),
// 		coins: int().notNull(),
// 		createdAt: datetime({ mode: "string", fsp: 3 })
// 			.default(sql`(CURRENT_TIMESTAMP(3))`)
// 			.notNull(),
// 		accountId: int()
// 			.notNull()
// 			.references(() => accounts.id, { onDelete: "restrict", onUpdate: "cascade" }),
// 	},
// 	(table) => {
// 		return {
// 			shopOrdersId: primaryKey({ columns: [table.id], name: "shop_orders_id" }),
// 		};
// 	},
// );
