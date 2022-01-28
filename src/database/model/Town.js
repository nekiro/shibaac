import { DataTypes } from 'sequelize';

const Town = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  posx: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  posy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  posz: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

export default Town;
