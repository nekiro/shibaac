import { DataTypes } from 'sequelize';

const Player = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vocation: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  looktype: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 136,
  },
  lookbody: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lookfeet: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lookhead: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  looklegs: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lookaddons: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maglevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sex: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lastlogin: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  town_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onlinetime: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
};

export default Player;
