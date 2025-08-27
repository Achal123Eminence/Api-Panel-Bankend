import express from 'express';
const router = express.Router();
import userRouter from './user.routes.js';
import redisRouter from './redis.routes.js';

router.use('/user',userRouter);
router.use('/sport',redisRouter);

export default router;