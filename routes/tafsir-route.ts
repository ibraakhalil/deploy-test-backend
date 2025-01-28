import { Router } from 'express';
import { getTafsirByVerseKey } from '../controllers/tafsir-controllers';
import { validateTafsirRequest } from '../middleware/validation/tafsir-validation';
const router = Router();

router.get('/:surahId/:ayahId', validateTafsirRequest, getTafsirByVerseKey);

export default router;
