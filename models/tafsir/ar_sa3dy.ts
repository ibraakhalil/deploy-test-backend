import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';

class ArSa3dy extends Model {
  public id!: number;
  public surah_id!: number;
  public ayah_id!: number;
  public tafsir_text!: string;
}

ArSa3dy.init(
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
      allowNull: true,
    },
  },
  {
    sequelize, // Pass the sequelize instance
    tableName: 'ar_sa3dy', // Specify the table name
    timestamps: false, // Disable createdAt and updatedAt
  }
);

export default ArSa3dy;
