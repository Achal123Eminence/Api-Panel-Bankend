import express from 'express';
const router = express.Router();
import userRouter from './user.routes.js';
import redisRouter from './redis.routes.js';
import eventRouter from './events.routes.js';
import currencyRouter from './currency.routes.js';
import manualRouter from './manual.routes.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

router.use('/user',userRouter);
router.use('/sport',authMiddleware,redisRouter);
router.use('/event',authMiddleware,eventRouter);
router.use('/currency',authMiddleware,currencyRouter);
router.use('/manual',authMiddleware,manualRouter);

export default router;