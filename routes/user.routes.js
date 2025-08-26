import express from 'express';
const userRouter = express.Router();
import { createUser } from '../controller/user.controller.js';

userRouter.post('/add',createUser);

export default userRouter;