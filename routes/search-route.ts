import express from 'express';
import { arabicSearch } from '../controllers/search/arabic-search';
import { tafsirSearch } from '../controllers/search/tafsir-search';
import { translationSearch } from '../controllers/search/translation-search';
import { validateArabicSearch, validateTafsirSearch } from '../middleware/validation/search-validation';
const router = express.Router();

router.get('/translations', translationSearch);
router.get('/tafsir', validateTafsirSearch, tafsirSearch);
router.get('/arabic', validateArabicSearch, arabicSearch);

// router.get('/tafsir', async (req, res, next) => {
//   const results = await sequelize.query(
//     `SELECT ayah_id, sura_id,
//     CASE WHEN en_kathir like '%done%' THEN en_kathir end as en_kathir,
//     CASE WHEN bn_zakaria like '%done%' THEN bn_zakaria end as bn_zakaria

//     FROM (SELECT ek.ayah_id, ek.sura_id, ek.tafsir_text as en_kathir, bz.tafsir_text as bn_zakaria
//     FROM en_kathir ek
//     INNER JOIN bn_zakaria bz
//     on ek.ayah_id = bz.ayah_id
//     and ek.sura_id = bz.sura_id)

//     WHERE en_kathir like '%done%'
//     or bn_zakaria like '%done%'

//     LIMIT 10`,
//     {
//       type: QueryTypes.SELECT,
//     }
//   );
//   res.json(results);
// });

export default router;
