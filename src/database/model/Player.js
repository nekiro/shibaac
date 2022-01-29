import { DataTypes } from 'sequelize';

const Player = {
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

export default Player;
