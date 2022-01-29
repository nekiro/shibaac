import { DataTypes, Model } from 'sequelize';

export class News extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
}

export const NewsSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
