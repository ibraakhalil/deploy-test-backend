import { Request } from 'express';
import { literal, Model, Op } from 'sequelize';
import { Literal } from 'sequelize/types/utils';
import Translations from '../models/translations-model';
import WBW from '../models/wbw-model';

interface QueryTypes {
  text?: string;
  page?: string;
  translations?: string;
  type?: string;
}

interface SearchResults {
  rows: Array<any>;
  count: number;
  pageLimit: number;
  page: number | string;
  translationColumns: string[];
  searchTerms: string[];
}

export async function getSearchTranslations(req: Request): Promise<SearchResults> {
  const { text = '', page = '1', translations = 'en_sahih', type = 'exact' } = req.query as QueryTypes;

  const translationColumns = text === '' ? [] : translations.split(',');
  const pageLimit = 10;
  const offset = (parseInt(page, 10) - 1) * pageLimit;
  const searchTerms = type === 'partial' ? text.split(' ').filter(term => term.length > 0) : [text.trim()];

  const whereConditions = translationColumns.reduce((conditions, column) => {
    searchTerms.forEach(term => {
      conditions.push({
        [column]: {
          [Op.like]: `%${term}%`,
        },
      });
    });
    return conditions;
  }, []);

  const buildColumnCase = (column: string) => {
    const conditions = searchTerms.map(term => `${column} LIKE '%${term}%'`).join(' OR ');

    return literal(`CASE
      WHEN (${conditions}) THEN ${column}
      ELSE NULL
      END`);
  };

  const attributes = ['id', 'surah_id', 'ayah_id'] as Array<string | [literal: Literal, alias: string]>;

  translationColumns.forEach(column => {
    attributes.push([buildColumnCase(column), column]);
  });

  const { count, rows } = await Translations.findAndCountAll({
    attributes,
    where: {
      [Op.or]: whereConditions,
    },
    limit: pageLimit,
    offset: offset,
    raw: true,
  });

  return { count, rows, page, pageLimit, translationColumns, searchTerms };
}

export async function getWordsForEveryMatchedAyah(verses: any[]): Promise<Model<any, any>[]> {
  const conditions = verses.map((verse: any) => ({
    surah_id: verse.surah_id,
    ayah_id: verse.ayah_id,
  }));

  const words = await WBW.findAll({
    attributes: ['ayah_id', 'surah_id', 'indopak', 'uthmani', 'en'],
    where: {
      [Op.or]: conditions,
    },
    raw: true,
  });

  return words;
}
