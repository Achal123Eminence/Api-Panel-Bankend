import express from 'express';
const router = express.Router();
import userRouter from './user.routes.js';
import redisRouter from './redis.routes.js';
import eventRouter from './events.routes.js';
import currencyRouter from './currency.routes.js';
import manualRouter from './manual.routes.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../middleware/rateLimit.middleware.js';
import { fingerprintMiddleware } from '../middleware/fingerprint.middleware.js';
import runningMatchesRouter from './runningMatches.routes.js';

// Rate limiter globally Applied
router.use(rateLimiter);

router.use('/user',userRouter);
router.use('/sport',authMiddleware,fingerprintMiddleware,redisRouter);
router.use('/event',authMiddleware,fingerprintMiddleware,eventRouter);
router.use('/currency',authMiddleware,fingerprintMiddleware,currencyRouter);
router.use('/manual',authMiddleware,fingerprintMiddleware,manualRouter);
router.use('/running-matches',authMiddleware,fingerprintMiddleware,runningMatchesRouter);

export default router;