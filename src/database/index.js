const { Sequelize } = require('sequelize');
import { dbCredentials } from '../util/config';
import PlayerModel from './model/Player';
import AccountModel from './model/Account';
import NewsModel from './model/News';
import PlayersOnlineModel from './model/PlayersOnline';
import TownModel from './model/Town';

export const sequelize = new Sequelize(
  dbCredentials.database,
  dbCredentials.user,
  dbCredentials.password,
  {
    host: dbCredentials.host,
    port: dbCredentials.port,
    dialect: 'mysql',
  }
);

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// })();

export const AccountEntity = sequelize.define('account', AccountModel, {
  tableName: 'accounts',
  timestamps: false,
});

export const PlayerEntity = sequelize.define('player', PlayerModel, {
  tableName: 'players',
  timestamps: false,
});

export const NewsEntity = sequelize.define('news', NewsModel, {
  tableName: 'aac_news',
  timestamps: false,
});

export const PlayersOnlineEntity = sequelize.define(
  'players_online',
  PlayersOnlineModel,
  {
    tableName: 'players_online',
    timestamps: false,
  }
);

export const TownEntity = sequelize.define('towns', TownModel, {
  tableName: 'towns',
  timestamps: false,
});

// Associations
AccountEntity.hasMany(PlayerEntity, {
  foreignKey: 'account_id',
});

PlayerEntity.belongsTo(AccountEntity, { foreignKey: 'account_id' });

PlayersOnlineEntity.belongsTo(PlayerEntity, { foreignKey: 'player_id' });
PlayerEntity.hasOne(PlayersOnlineEntity, { foreignKey: 'player_id' });
