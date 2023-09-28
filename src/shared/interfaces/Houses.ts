export interface House {
	id: number;
	owner: number;
	paid: number;
	warnings: number;
	name: string;
	rent: number;
	town_id: number;
	bid: number;
	bid_end: number;
	last_bid: number;
	highest_bidder: number;
	size: number;
	guildId: null | number;
	beds: number;
}
