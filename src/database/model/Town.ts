import { DataTypes, Model } from 'sequelize';

export class Town extends Model {
  public id!: number;
  public name!: string;
  public posx!: number;
  public posy!: number;
  public posz!: number;
}

export const TownSchema = {
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
