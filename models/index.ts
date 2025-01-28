import QuranMain from './quran-main-model';
import WBW from './wbw-model';

QuranMain.hasMany(WBW, { foreignKey: 'surah_id', sourceKey: 'surah_id', as: 'words' });
WBW.belongsTo(QuranMain, { foreignKey: 'surah_id', targetKey: 'surah_id', as: 'quran' });

export const models = {
  wbw: WBW,
  quran: QuranMain,
};
