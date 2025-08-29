import express from 'express';
const router = express.Router();
import userRouter from './user.routes.js';
import redisRouter from './redis.routes.js';
import eventRouter from './events.routes.js';

router.use('/user',userRouter);
router.use('/sport',redisRouter);
router.use('/event',eventRouter);

export default router;