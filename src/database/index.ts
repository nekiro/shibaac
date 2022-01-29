import { Sequelize } from 'sequelize';
import { Player, PlayerSchema } from './model/Player';
import { Account, AccountSchema } from './model/Account';
import { News, NewsSchema } from './model/News';
import { PlayersOnline, PlayersOnlineSchema } from './model/PlayersOnline';
import { Town, TownSchema } from './model/Town';

export const sequelize = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    dialect: 'mysql',
  }
);

export const AccountEntity = Account.init(AccountSchema, {
  sequelize,
  tableName: 'accounts',
  timestamps: false,
  modelName: 'account',
});

export const PlayerEntity = Player.init(PlayerSchema, {
  sequelize,
  tableName: 'players',
  timestamps: false,
  modelName: 'player',
});

export const NewsEntity = News.init(NewsSchema, {
  sequelize,
  tableName: 'aac_news',
  modelName: 'news',
  timestamps: false,
});

export const TownEntity = Town.init(TownSchema, {
  sequelize,
  tableName: 'towns',
  timestamps: false,
  modelName: 'town',
});

export const PlayersOnlineEntity = PlayersOnline.init(PlayersOnlineSchema, {
  sequelize,
  tableName: 'players_online',
  timestamps: false,
});

// Associations
AccountEntity.hasMany(PlayerEntity, {
  foreignKey: 'account_id',
});

PlayerEntity.belongsTo(AccountEntity, { foreignKey: 'account_id' });

PlayersOnlineEntity.belongsTo(PlayerEntity, { foreignKey: 'player_id' });
PlayerEntity.hasOne(PlayersOnlineEntity, { foreignKey: 'player_id' });
