import { NextFunction, Request, Response } from 'express';
import { getSearchTranslations, getWordsForEveryMatchedAyah } from '../../services/search-services';

interface TranslationRow {
  id: number;
  surah_id: number;
  ayah_id: number;
  [key: string]: string | number | null;
}

export const translationSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { count, rows, page, pageLimit, translationColumns, searchTerms } = await getSearchTranslations(req);
    const allWords = await getWordsForEveryMatchedAyah(rows);

    const combinedTranslations = rows.reduce((prev, translation: TranslationRow) => {
      const { id, ayah_id, surah_id } = translation;
      const filteredWords = allWords.filter((word: any) => word.surah_id === surah_id && word.ayah_id === ayah_id);

      prev.push({
        id,
        surah_id,
        ayah_id,
        words: filteredWords,
        translations: translationColumns.map(item => {
          return { value: item, text: translation[item] };
        }),
      });

      return prev;
    }, []);

    res.status(200).json({
      count,
      pageLimit,
      searchTerms,
      pageNumber: page,
      translationsData: combinedTranslations,
    });
  } catch (err) {
    next(err);
  }
};
