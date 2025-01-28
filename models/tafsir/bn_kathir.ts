import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';

class BnKathir extends Model {
  public id!: number;
  public start!: number;
  public end!: number;
  public tafsirText!: string;
  public surahId!: number;
}

BnKathir.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    start: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    end: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tafsirText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'tafsir_text',
    },
    surahId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sura_id',
    },
  },
  {
    sequelize,
    tableName: 'bn_kathir',
    timestamps: false,
  }
);

export default BnKathir;
