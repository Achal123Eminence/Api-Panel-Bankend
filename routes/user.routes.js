import express from 'express';
const userRouter = express.Router();
import { createUser, login } from '../controller/user.controller.js';

userRouter.post('/add',createUser);
userRouter.post('/login',login);

export default userRouter;