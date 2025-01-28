import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';

class EnKathir extends Model {
  public id!: number;
  public surah_id!: number;
  public ayah_id!: number;
  public tafsir_text?: string;
}

EnKathir.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    surah_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    ayah_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    tafsir_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'en_kathir',
    timestamps: false,
  }
);

export default EnKathir;
