import { NextFunction, Request, Response } from 'express';
import { FindOptions, Op } from 'sequelize';
import { TafsirByAyah, TafsirStartEnd } from '../models/tafsir';

interface TafsirModelType {
  findAll: (options: FindOptions) => Promise<any[]>;
}

interface TafsirResult {
  ayah_id?: number;
  start?: number;
  end?: number;
  surah_id: number;
  tafsir_text: string;
}

export const getTafsirByVerseKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { parsedSurahId, parsedAyahId, tafsirName } = req.validatedData!;
  const ByAyahModel = TafsirByAyah[tafsirName as keyof typeof TafsirByAyah] as TafsirModelType | undefined;
  const StartEndModel = TafsirStartEnd[tafsirName as keyof typeof TafsirStartEnd] as TafsirModelType | undefined;

  try {
    let tafsir: TafsirResult[] = [];

    if (ByAyahModel) {
      tafsir = await ByAyahModel.findAll({
        attributes: ['ayah_id', 'surah_id', 'tafsir_text'],
        where: { surah_id: parsedSurahId, ayah_id: parsedAyahId },
      });
    } else if (StartEndModel) {
      const results = await StartEndModel.findAll({
        attributes: ['surah_id', 'start', 'end', 'tafsir_text'],
        where: {
          surah_id: parsedSurahId,
          start: { [Op.lte]: parsedAyahId },
          end: { [Op.gte]: parsedAyahId },
        },
        raw: true,
      });

      tafsir = results.map(result => ({
        ayah_id: parsedAyahId,
        ...result,
      }));
    }

    if (tafsir.length === 0) {
      res.status(404).json({ error: 'No tafsir found for the given verse' });
    } else {
      res.status(200).json(tafsir);
    }
  } catch (err) {
    next(err);
  }
};
