import { NextFunction, Request, Response } from 'express';
import { param, query, validationResult } from 'express-validator';
import { TafsirByAyah, TafsirStartEnd } from '../../models/tafsir';

declare global {
  namespace Express {
    interface Request {
      validatedData?: {
        parsedSurahId: number;
        parsedAyahId: number;
        tafsirName: string;
      };
    }
  }
}

export const validateTafsirRequest = [
  param('surahId').isInt({ min: 1, max: 114 }).withMessage('Surah ID must be an integer between 1 and 114'),
  param('ayahId').isInt({ min: 1 }).withMessage('Ayah ID must be a positive integer'),
  query('name')
    .isString()
    .notEmpty()
    .withMessage('Tafsir name must be a non-empty string')
    .custom(value => {
      if (!(value in TafsirByAyah) && !(value in TafsirStartEnd)) {
        throw new Error('Invalid tafsir model');
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    req.validatedData = {
      parsedSurahId: parseInt(req.params.surahId, 10),
      parsedAyahId: parseInt(req.params.ayahId, 10),
      tafsirName: req.query.name as string,
    };

    next();
  },
];
