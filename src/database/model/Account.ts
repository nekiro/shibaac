import { DataTypes, Model } from 'sequelize';

export class Account extends Model {
  public id!: number;
  public name!: string;
}

export const AccountModel = {
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
  password: {
    // TODO, this is included, because server is in development, get rid of it, or dont include by default
    type: DataTypes.STRING,
    allowNull: false,
  },
  secret: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  type: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  premium_ends_at: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creation: {
    type: DataTypes.INTEGER,
    defaultValue: DataTypes.NOW,
  },
};
