import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import WBW from '../models/wbw-model';
import { wordsToAyahGrouper } from '../services/wbw-services';

export const getWordsBySurahId = async (req: Request, res: Response, next: NextFunction) => {
  const surahId = parseInt(req.params.surahId, 10);
  const ayahId = req.query.ayah_id ? parseInt(req.query.ayah_id as string, 10) : undefined;
  if (isNaN(surahId)) {
    return res.status(400).json({ error: 'Invalid surahId. Must be a number.' });
  }

  try {
    const where: { surah_id: number; ayah_id?: number } = { surah_id: surahId };
    if (ayahId) {
      where.ayah_id = ayahId;
    }

    const words = await WBW.findAll({
      where,
      attributes: ['ayah_id', 'surah_id', 'indopak', 'uthmani', 'en', 'bn', 'code_v2'],
      raw: true,
    });

    const results = wordsToAyahGrouper(words);

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

export const getWordsByPageId = async (req: Request, res: Response, next: NextFunction) => {
  const pageId = req.params.pageId;

  try {
    const words = await WBW.findAll({
      where: { page: pageId },
      attributes: ['ayah_id', 'surah_id', 'indopak', 'uthmani', 'en', 'bn', 'code_v2'],
      raw: true,
    });

    const groupedBySurahId = words.reduce((acc: any, word: any) => {
      const { ayah_id, surah_id, indopak, uthmani, en, bn, code_v2 } = word;

      if (!acc[surah_id]) {
        acc[surah_id] = [];
      }

      acc[surah_id].push({ ayah_id, surah_id, indopak, uthmani, en, bn, code_v2 });

      return acc;
    }, {});

    const results = Object.keys(groupedBySurahId).map((surahId: any) => {
      return {
        surahId: surahId,
        ayah: wordsToAyahGrouper(groupedBySurahId[surahId]),
      };
    });

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

export const getWordsByJuzId = async (req: Request, res: Response, next: NextFunction) => {
  const juzId = req.params.juzId;

  try {
    const words = await WBW.findAll({
      where: { para: juzId },
      attributes: ['ayah_id', 'surah_id', 'para', 'indopak', 'uthmani', 'en', 'bn', 'code_v2'],
      raw: true,
    });

    const groupedBySurahId = words.reduce((acc: any, word: any) => {
      const { ayah_id, surah_id, para, indopak, uthmani, en, bn, code_v2 } = word;

      if (!acc[surah_id]) acc[surah_id] = [];
      acc[surah_id].push({ ayah_id, surah_id, para, indopak, uthmani, en, bn, code_v2 });

      return acc;
    }, {});

    const results = Object.keys(groupedBySurahId).map((surahId: any) => {
      return {
        surahId: surahId,
        ayah: wordsToAyahGrouper(groupedBySurahId[surahId]),
      };
    });

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

export const getWordsByCustomAyah = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ayahs = req.query.ayah as string;
    const ayahsArray = ayahs.split(',').map(verse => {
      const [surah_id, ayah_id] = verse.split(':').map(Number);
      return { surah_id, ayah_id };
    });

    const words = await WBW.findAll({
      where: {
        [Op.or]: ayahsArray,
      },
      attributes: ['ayah_id', 'surah_id', 'indopak', 'uthmani', 'en', 'bn', 'code_v2'],
      raw: true,
    });

    const results = wordsToAyahGrouper(words);

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};
