import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';

class ArIbnKathir extends Model {
  public id!: number;
  public suraId!: number;
  public ayahId!: number;
  public tafsirText!: string;
}

ArIbnKathir.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    surahId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sura_id', // Map property to column name
    },
    ayahId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ayah_id',
    },
    tafsirText: {
      type: DataTypes.TEXT,
      allowNull: false, // Assuming tafsir text is required
      field: 'tafsir_text',
    },
  },
  {
    sequelize,
    tableName: 'ar_ibnkathir',
    timestamps: false,
  }
);

export default ArIbnKathir;
