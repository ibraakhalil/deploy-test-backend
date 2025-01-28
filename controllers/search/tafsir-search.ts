import { NextFunction, Request, Response } from 'express';
import { col, FindAndCountOptions, FindOptions, Op } from 'sequelize';
import { Literal } from 'sequelize/types/utils';
import { TafsirByAyah, TafsirStartEnd } from '../../models/tafsir';
import { getWordsForEveryMatchedAyah } from '../../services/search-services';

type QueryTypes = { text: string; tafsir: string; type: string; page: number | string };
type AttributeType = Array<string | [literal: Literal, alias: string]>;
type FindAndCountResult<T> = {
  count: number;
  rows: T[];
};

type TafsirModelType = {
  findAll: (options: FindOptions) => Promise<any[]>;
  findAndCountAll: (options: FindAndCountOptions) => Promise<FindAndCountResult<any>>;
};

export const tafsirSearch = async (req: Request, res: Response, next: NextFunction) => {
  const { text = '', tafsir, type = 'exact', page = 1 } = req.query as QueryTypes;
  const MAX_WORDS = 10;
  const pageLimit = 10;
  const pageNumber = !isNaN(parseInt(page.toString(), 10)) ? parseInt(page.toString(), 10) : 1;
  const offset = (pageNumber - 1) * pageLimit;
  const searchTerms = type === 'partial' ? text.split(' ').slice(0, MAX_WORDS) : [text.trim()];

  const searchCondition = searchTerms.map(word => ({
    tafsir_text: { [Op.like]: `%${word.trim()}%` },
  }));
  const ByAyahModel = TafsirByAyah[tafsir as keyof typeof TafsirByAyah] as TafsirModelType | undefined;
  const StartEndModel = TafsirStartEnd[tafsir as keyof typeof TafsirStartEnd] as TafsirModelType | undefined;
  const model = ByAyahModel || StartEndModel;

  try {
    if (!model) {
      return res.status(400).json({ message: 'Invalid tafsir type' });
    }

    const baseAttributes = {
      ByAyah: ['surah_id', 'ayah_id', [col('tafsir_text'), 'tafsir']] as AttributeType,
      StartEnd: [[col('start'), 'ayah_id'], 'surah_id', [col('tafsir_text'), 'tafsir']] as AttributeType,
    };

    const { count, rows } = await model.findAndCountAll({
      attributes: ByAyahModel ? baseAttributes.ByAyah : baseAttributes.StartEnd,
      where: { [Op.or]: searchCondition },
      limit: 10,
      offset,
      raw: true,
    });

    const allWords = await getWordsForEveryMatchedAyah(rows);
    const versesObj = allWords.reduce((acc: any, entry: any) => {
      const key = `${entry.ayah_id}:${entry.surah_id}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(entry);
      return acc;
    }, {});

    const finalData = rows.map((tafsir: any) => {
      const verseKey = `${tafsir.ayah_id}:${tafsir.surah_id}`;
      return {
        ...tafsir,
        words: versesObj[verseKey],
      };
    });

    return res.status(200).json({
      count,
      pageLimit,
      pageNumber,
      searchTerms,
      tafsirData: finalData,
    });
  } catch (err) {
    next(err);
  }
};
