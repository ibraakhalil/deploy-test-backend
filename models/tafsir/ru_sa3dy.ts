import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db'; // Adjust the path if needed

class RuSa3dy extends Model {
  public id!: number;
  public surah_id!: number;
  public ayah_id!: number;
  public tafsir_text!: string;
}

RuSa3dy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    surah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ayah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tafsir_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ru_sa3dy',
    timestamps: false,
  }
);

export default RuSa3dy;
