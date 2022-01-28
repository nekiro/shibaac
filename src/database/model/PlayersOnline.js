import { DataTypes } from 'sequelize';

const PlayersOnline = {
  player_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
};

export default PlayersOnline;
