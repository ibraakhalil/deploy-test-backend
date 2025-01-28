import { NextFunction, Request, Response } from 'express';
import Fuse from 'fuse.js';
import { Op } from 'sequelize';
import QuranMain from '../../models/quran-main-model';

type QueryTypes = {
  text: string;
  type?: string;
  page: string | number;
};

export const arabicSearch = async (req: Request, res: Response, next: NextFunction) => {
  const { text = '', type = 'partial', page = 1 } = req.query as QueryTypes;
  const pageLimit = 10;
  const MAX_WORDS = 10;
  const pageNumber = !isNaN(parseInt(page.toString(), 10)) ? parseInt(page.toString(), 10) : 1;
  const offset = (pageNumber - 1) * pageLimit;
  const searchTerms = type === 'partial' ? text.split(' ').slice(0, MAX_WORDS) : [text.trim()];

  const searchCondition = searchTerms.map(word => ({
    [Op.or]: [
      { clean: { [Op.like]: `%${word.trim()}%` } },
      { indopak: { [Op.like]: `%${word.trim()}%` } },
      { uthmani: { [Op.like]: `%${word.trim()}%` } },
    ],
  }));

  try {
    const { count, rows } = await QuranMain.findAndCountAll({
      attributes: ['surah_id', 'ayah_id', 'uthmani', 'indopak'],
      where: {
        [Op.or]: searchCondition,
      },
      limit: pageLimit,
      offset,
    });

    return res.status(200).json({
      count,
      pageLimit,
      pageNumber,
      searchTerms,
      arabicData: rows,
    });
  } catch (err) {
    next(err);
  }
};

export const arabicFuzzySearch = async (req: Request, res: Response, next: NextFunction) => {
  const { text = '' } = req.query as unknown as QueryTypes;

  try {
    const data = await QuranMain.findAll({
      attributes: ['uthmani', 'indopak'],
    });
    const options = {
      keys: ['uthmani', 'indopak'],
      threshold: 0.5,
    };

    const fuse = new Fuse(data, options);
    const fuzzyResult = fuse.search(text);

    res.status(201).json(fuzzyResult);
  } catch (err) {
    next(err);
  }
};
