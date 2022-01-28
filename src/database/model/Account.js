import { DataTypes } from 'sequelize';

const Account = {
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

export default Account;
