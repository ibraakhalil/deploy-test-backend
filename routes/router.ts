import { NextFunction, Request, Response, Router } from 'express';
import searchRoute from './search-route';
import testRoute from './test-route';
import translationsRoute from './translation-route';
import tafsirRoute from './tafsir-route';
import wbwRoute from './wbw-route';
const router = Router();

router.use('/wbw', wbwRoute);
router.use('/translations', translationsRoute);
router.use('/tafsir', tafsirRoute);
router.use('/search', searchRoute);
router.use('/test', testRoute);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const customError = {
    Message: err.message,
    Stack: err.stack?.substring(0, 300) + '...',
  };
  console.error(customError);
  res.status(500).json({
    error: 'Internal Server Error',
  });
});

export default router;
