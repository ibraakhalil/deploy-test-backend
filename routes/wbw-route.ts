import { Router } from 'express';
import { getWordsByCustomAyah, getWordsByJuzId, getWordsByPageId, getWordsBySurahId } from '../controllers/wbw-controller';
const router = Router();

router.get('/by_surah/:surahId', getWordsBySurahId);
router.get('/by_juz/:juzId', getWordsByJuzId);
router.get('/by_page/:pageId', getWordsByPageId);
router.get('/custom', getWordsByCustomAyah);

export default router;
