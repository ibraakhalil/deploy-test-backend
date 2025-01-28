import { NextFunction, Request, Response } from 'express';
import Translations from '../models/translations-model';
import { formatVerseTranslations } from '../services/translation-services';

export const getTranslationBySurahId = async (req: Request, res: Response, next: NextFunction) => {
  const surahId = req.params.surahId || '1';
  const requestedTranslations = (req.query.translation as string) || 'en_sahih';
  const ayahId = (req.query.ayah_id as string) || undefined;
  const whereCondition: { surah_id: string; ayah_id?: string } = { surah_id: surahId };

  if (ayahId) {
    whereCondition.ayah_id = ayahId;
  }

  try {
    const verses = await Translations.findAll({
      where: whereCondition,
      attributes: ['ayah_id', 'surah_id', ...requestedTranslations.split(',')],
    });

    const results = formatVerseTranslations(verses, requestedTranslations.split(','));

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};
