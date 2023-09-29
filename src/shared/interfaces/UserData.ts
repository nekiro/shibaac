export interface Player {
  id: number;
  name: string;
  level: number;
  vocation: number;
}

export interface UserData {
  id: number;
  name: string;
  password: string;
  email: string;
  premdays: number;
  premdays_purchased: number;
  lastday: number;
  type: number;
  coins: number;
  coins_transferable: number;
  tournament_coins: number;
  recruiter: number;
  is_verified: boolean;
  creation: number;
  token_secret: string | null;
  rec_key: string | null;
  twoFASecret: string | null;
  twoFAEnabled: boolean;
  tournamentBalance: number;
  resetToken: string | null;
  players: Player[];
}
