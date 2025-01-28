import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db'; // Adjust path if needed

class BnZakaria extends Model {
  public id!: number;
  public surahId!: number;
  public ayahId!: number;
  public tafsirText!: string;
  static getTafsirBySurahId(ayahId: number) {
    return this.findAll({
      where: { surahId: 2 },
      order: [['ayahId', 'ASC']],
    });
  }
}

BnZakaria.init(
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
      field: 'sura_id',
    },
    ayahId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ayah_id',
    },
    tafsirText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'tafsir_text',
    },
  },
  {
    sequelize,
    tableName: 'bn_zakaria',
    timestamps: false,
  }
);

export default BnZakaria;
