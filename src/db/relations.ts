import { relations } from "drizzle-orm/relations";
import { houses, houseLists } from "./schema";
import { News } from "./schema/news";
import { Accounts } from "./schema/accounts";
import { accountBans } from "./schema/accountBans";
import { Players } from "./schema/players";
import { PlayerDeaths } from "./schema/playerDeaths";
import { playersOnline } from "./schema/playersOnline";

export const aacNewsRelations = relations(News, ({ one }) => ({
	account: one(Accounts, {
		fields: [News.authorId],
		references: [Accounts.id],
	}),
}));

export const AccountsRelations = relations(Accounts, ({ many }) => ({
	News: many(News),
	accountBans: many(accountBans),
	players: many(Players),
	// purchases: many(purchases),
	// shopOrders: many(shopOrders),
}));

export const accountBansRelations = relations(accountBans, ({ one }) => ({
	account: one(Accounts, {
		fields: [accountBans.accountId],
		references: [Accounts.id],
	}),
	player: one(Players, {
		fields: [accountBans.bannedBy],
		references: [Players.id],
	}),
}));

export const playersRelations = relations(Players, ({ one, many }) => ({
	accountBans: many(accountBans),
	// guildInvites: many(guildInvites),
	// guildMemberships: many(guildMembership),
	// guilds: many(guilds),
	playerDeaths: many(PlayerDeaths),
	account: one(Accounts, {
		fields: [Players.accountId],
		references: [Accounts.id],
	}),
	playersOnlines: many(playersOnline),
}));

// export const guildInvitesRelations = relations(guildInvites, ({ one }) => ({
// 	guild: one(guilds, {
// 		fields: [guildInvites.guildId],
// 		references: [guilds.id],
// 	}),
// 	player: one(players, {
// 		fields: [guildInvites.playerId],
// 		references: [players.id],
// 	}),
// }));

// export const guildsRelations = relations(guilds, ({ one, many }) => ({
// 	guildInvites: many(guildInvites),
// 	guildMemberships: many(guildMembership),
// 	guildRanks: many(guildRanks),
// 	guildWars_guild1: many(guildWars, {
// 		relationName: "guildWars_guild1_guilds_id",
// 	}),
// 	guildWars_guild2: many(guildWars, {
// 		relationName: "guildWars_guild2_guilds_id",
// 	}),
// 	player: one(players, {
// 		fields: [guilds.ownerid],
// 		references: [players.id],
// 	}),
// }));

// export const guildMembershipRelations = relations(guildMembership, ({ one }) => ({
// 	guild: one(guilds, {
// 		fields: [guildMembership.guildId],
// 		references: [guilds.id],
// 	}),
// 	player: one(players, {
// 		fields: [guildMembership.playerId],
// 		references: [players.id],
// 	}),
// 	guildRank: one(guildRanks, {
// 		fields: [guildMembership.rankId],
// 		references: [guildRanks.id],
// 	}),
// }));

// export const guildRanksRelations = relations(guildRanks, ({ one, many }) => ({
// 	guildMemberships: many(guildMembership),
// 	guild: one(guilds, {
// 		fields: [guildRanks.guildId],
// 		references: [guilds.id],
// 	}),
// }));

// export const guildWarsRelations = relations(guildWars, ({ one, many }) => ({
// 	guild_guild1: one(guilds, {
// 		fields: [guildWars.guild1],
// 		references: [guilds.id],
// 		relationName: "guildWars_guild1_guilds_id",
// 	}),
// 	guild_guild2: one(guilds, {
// 		fields: [guildWars.guild2],
// 		references: [guilds.id],
// 		relationName: "guildWars_guild2_guilds_id",
// 	}),
// 	guildwarKills: many(guildwarKills),
// }));

// export const guildwarKillsRelations = relations(guildwarKills, ({ one }) => ({
// 	guildWar: one(guildWars, {
// 		fields: [guildwarKills.warid],
// 		references: [guildWars.id],
// 	}),
// }));

export const houseListsRelations = relations(houseLists, ({ one }) => ({
	house: one(houses, {
		fields: [houseLists.houseId],
		references: [houses.id],
	}),
}));

export const housesRelations = relations(houses, ({ many }) => ({
	houseLists: many(houseLists),
}));

export const playerDeathsRelations = relations(PlayerDeaths, ({ one }) => ({
	player: one(Players, {
		fields: [PlayerDeaths.playerId],
		references: [Players.id],
	}),
}));

export const playersOnlineRelations = relations(playersOnline, ({ one }) => ({
	player: one(Players, {
		fields: [playersOnline.playerId],
		references: [Players.id],
	}),
}));

// export const purchasesRelations = relations(purchases, ({ one }) => ({
// 	account: one(Accounts, {
// 		fields: [purchases.accountId],
// 		references: [Accounts.id],
// 	}),
// }));

// export const shopOrdersRelations = relations(shopOrders, ({ one }) => ({
// 	account: one(Accounts, {
// 		fields: [shopOrders.accountId],
// 		references: [Accounts.id],
// 	}),
// }));
