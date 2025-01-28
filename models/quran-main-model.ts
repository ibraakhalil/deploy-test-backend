import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class QuranMain extends Model {}

QuranMain.init(
  {
    surah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    ayah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    para: DataTypes.INTEGER,
    hijb: DataTypes.TEXT,
    page: DataTypes.INTEGER,
    page_v2: DataTypes.INTEGER,
    uthmani: DataTypes.TEXT,
    indopak: DataTypes.TEXT,
    clean: DataTypes.TEXT,
    qcf: DataTypes.TEXT,
    fonts: DataTypes.TEXT,
    tafsir_kathir: DataTypes.INTEGER,
    tafsir_fmazid: DataTypes.INTEGER,
    tafsir_kathir_mujibor: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'QuranMain',
    tableName: 'quran_main',
    timestamps: false,
  }
);

export default QuranMain;
