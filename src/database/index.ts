const { Sequelize } = require('sequelize');
import { dbCredentials } from '../util/config';
import { Player, PlayerModel } from './model/Player';
import { Account, AccountModel } from './model/Account';
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

export const AccountEntity = Account.init(AccountModel, {
  sequelize,
  tableName: 'accounts',
  timestamps: false,
  modelName: 'account',
});

export const PlayerEntity = Player.init(PlayerModel, {
  sequelize,
  tableName: 'players',
  timestamps: false,
  modelName: 'player',
});

// export const PlayerEntity = sequelize.define('player', PlayerModel, {
//   tableName: 'players',
//   timestamps: false,
// });

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
Account.hasMany(PlayerEntity, {
  foreignKey: 'account_id',
});

PlayerEntity.belongsTo(Account, { foreignKey: 'account_id' });

PlayersOnlineEntity.belongsTo(PlayerEntity, { foreignKey: 'player_id' });
PlayerEntity.hasOne(PlayersOnlineEntity, { foreignKey: 'player_id' });
