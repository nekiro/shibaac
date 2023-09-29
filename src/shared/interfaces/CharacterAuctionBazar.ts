export interface CharacterData {
  id: string;
  name: string;
  level: number;
  vocation: string;
  transfer: boolean;
  coins: number;
  pvpType: string;
  remainingTime: number;
  hasBeenBidded: boolean;
  battlEyeStatus: boolean;
  world: string;
  items: any[];
  skills: any[];
  quests: any[];
  extras: {
    wastedCoins: number;
  };
  equipedItems: any[];
  imbuements: any[];
  charms: {
    charm_points: string;
    charm_expansion: number;
    rune_wound: number;
  };
  BazarBids: BidList[];
  isOwner?: boolean;
}

type BidList = {
  amount: number;
  bazarListingId: number;
  bidderPlayerName: string;
  id: number;
  createdAt: Date;
};
