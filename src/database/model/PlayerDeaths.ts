import { DataTypes, Model } from 'sequelize';

export class PlayerDeaths extends Model {
  public player_id!: number;
  public time!: number;
  public level!: number;
  public killed_by!: string;
  public is_player!: boolean;
  public mostdamage_by!: string;
  public mostdamage_is_player!: boolean;
  public unjustified!: boolean;
  public mostdamage_unjustified!: boolean;
}

export const PlayerDeathsSchema = {
  player_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  time: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  killed_by: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  is_player: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
  },
  mostdamage_by: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  mostdamage_is_player: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  unjustified: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  mostdamage_unjustified: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
};
