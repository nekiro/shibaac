import { DataTypes, Model } from 'sequelize';

export class Player extends Model {
  public id!: number;
  public name!: string;
  public group_id!: number;
  public account_id!: number;
  public level!: number;
  public vocation!: number;
  public experience!: number;
  public looktype!: number;
  public lookbody!: number;
  public lookhead!: number;
  public lookfeet!: number;
  public looklegs!: number;
  public lookaddons!: number;
  public maglevel!: number;
  public sex!: number;
  public lastlogin!: number;
  public town_id!: number;
  public onlinetime!: number;
}

export const PlayerSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 8,
  },
  vocation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4200,
  },
  looktype: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 136,
  },
  lookbody: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lookfeet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lookhead: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  looklegs: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lookaddons: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  maglevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  sex: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lastlogin: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  town_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  onlinetime: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
};
