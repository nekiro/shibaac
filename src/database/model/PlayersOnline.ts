import { DataTypes, Model } from 'sequelize';

export class PlayersOnline extends Model {
  public player_id!: number;
}

export const PlayersOnlineSchema = {
  player_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
};
