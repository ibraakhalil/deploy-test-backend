import { NextFunction, Request, RequestHandler, Response } from 'express';
import { check, query, validationResult } from 'express-validator';
import { TafsirByAyah, TafsirStartEnd } from '../../models/tafsir';

export const validateArabicSearch: RequestHandler[] = [
  check('text').isString().withMessage('Text must be a string.').trim().escape(),
  check('type').optional().isIn(['exact', 'partial']).withMessage('Type must be either "exact" or "partial".'),
  check('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.').toInt(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err: any) => ({
          param: err.param,
          message: err.msg,
        })),
      });
    }
    next();
  },
];

export const validateTafsirSearch: RequestHandler[] = [
  check('text').isString().withMessage('Text must be a string.').trim().escape(),
  check('type').optional().isIn(['exact', 'partial']).withMessage('Type must be either "exact" or "partial".'),
  query('tafsir')
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
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err: any) => ({
          param: err.param,
          message: err.msg,
        })),
      });
    }
    next();
  },
];
