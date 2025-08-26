import express from 'express';
const router = express.Router();
import userRouter from './user.routes.js';

router.use('/user',userRouter);

export default router;