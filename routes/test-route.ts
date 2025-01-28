import { Router } from 'express';
import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db';
// import { getCachedData } from '../controllers/cach-controllers';
import { models } from '../models/index';
import en_kathir from '../models/tafsir/en_kathir';
import Test from '../models/test-model';
import Translations from '../models/translations-model';
import WBW from '../models/wbw-model';
const router = Router();

router.post('/user', async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await Test.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

router.get('/user', async (req, res) => {
  try {
    const users = await Test.findAll();
    res.status(200).send({ users });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

router.get('/wbw', async (req, res, next) => {
  try {
    const wbwData = await sequelize.query(
      `SELECT ayah, json_group_array(
              json_object(
                'id', id,
                'uthmani', uthmani,
                'indopak', indopak
              )) AS words
          FROM WBW WHERE sura = 2
          GROUP BY ayah
          ORDER BY ayah ASC;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const formattedResult = wbwData.map((item: any) => ({
      ayah: item.ayah,
      words: JSON.parse(item.words),
    }));

    res.status(200).json(formattedResult);
  } catch (err) {
    next(err);
  }
});

type QueryType = { text?: string; page?: string; translations?: string };

router.get('/search', async (req, res, next) => {
  const { translations = 'en' } = req.query as QueryType;

  const translateItems = translations.split(',');

  try {
    const searchData = await sequelize.query(`SELECT
    wbw.ayah,
    wbw.sura,
    CASE
        WHEN translations.en_sahih LIKE '%allah%' THEN translations.en_sahih
        ELSE NULL
    END AS en_sahih,
    CASE
        WHEN translations.en_haleem LIKE '%allah%' THEN translations.en_haleem
        ELSE NULL
    END AS en_haleem,
    GROUP_CONCAT(wbw.uthmani) AS words
FROM
    translations
JOIN
    wbw
ON
    translations.sura_id = wbw.sura
AND
    translations.ayah_id = wbw.ayah
WHERE
    translations.en_sahih LIKE '%allah%'
    OR translations.en_haleem LIKE '%allah%'
GROUP BY
    wbw.sura, wbw.ayah
LIMIT 10;
`);

    res.json(searchData);
  } catch (e) {
    next(e);
  }
});

router.get('/class', async (req, res, next) => {
  try {
    const translationsWithWBW = await Translations.findAll({
      attributes: ['ayah_id', 'sura_id', 'bn_zakaria'],
      where: {
        sura_id: 1,
        ayah_id: 4,
      },
      include: [
        {
          model: WBW,
          attributes: ['ayah', 'uthmani', 'indopak'],
        },
      ],
    });

    res.status(200).json(translationsWithWBW);
  } catch (err) {
    next(err);
  }
});

router.get('/tafsirr', async (req, res, next) => {
  try {
    const tafsir = await en_kathir.findAll({
      where: {
        surah_id: 1,
        ayah_id: 4,
      },
      include: [
        {
          model: WBW,
          as: 'words',
        },
      ],
    });

    res.status(200).json(tafsir);
  } catch (err) {
    next(err);
  }
});

router.get('/quran', async (req, res, next) => {
  try {
    const ayahs = await models.quran.findAll({
      where: { surah_id: 2 },
      attributes: ['ayah_id', 'surah_id'],
      include: [
        {
          model: models.wbw,
          as: 'words',
          attributes: ['uthmani'],
          required: false,
          where: {
            surah_id: 2,
            ayah_id: { [Op.col]: 'QuranMain.ayah_id' },
          },
        },
      ],
      order: [['ayah_id', 'ASC']],
      limit: 20,
    });

    res.status(200).json(ayahs);
  } catch (err) {
    next(err);
  }
});

// router.get('/data', getCachedData, async (req, res) => {
//   const data = { message: 'Hello from API!' }; // Example data
//   res.json(data);
// });

export default router;
