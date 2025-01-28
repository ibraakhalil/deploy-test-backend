import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class WBW extends Model {}

WBW.init(
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
    word_position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    uthmani: DataTypes.TEXT,
    indopak: DataTypes.TEXT,
    bn: DataTypes.TEXT,
    de: DataTypes.TEXT,
    en: DataTypes.TEXT,
    hi: DataTypes.TEXT,
    in: DataTypes.TEXT,
    inh: DataTypes.TEXT,
    ru: DataTypes.TEXT,
    ta: DataTypes.TEXT,
    tr: DataTypes.TEXT,
    ur: DataTypes.TEXT,
    audio: DataTypes.TEXT,
    page: DataTypes.INTEGER,
    page_v2: DataTypes.INTEGER,
    para: DataTypes.INTEGER,
    hijb: DataTypes.INTEGER,
    id: DataTypes.INTEGER,
    qcf: DataTypes.TEXT,
    code_v2: DataTypes.TEXT,
    line_number: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'WBW',
    tableName: 'wbw',
    timestamps: false,
  }
);

export default WBW;
