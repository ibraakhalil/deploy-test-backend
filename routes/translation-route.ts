import { Router } from 'express';
import { getTranslationBySurahId } from '../controllers/translation-controller';
const router = Router();

router.get('/by_surah/:surahId', getTranslationBySurahId);

export default router;
