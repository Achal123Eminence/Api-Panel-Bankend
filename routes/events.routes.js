import express from "express";
import { addEventController } from "../controller/event.controller.js";
import { createDefault } from "../controller/default-setting.controller.js";
const eventRouter = express.Router();

eventRouter.post('/add',addEventController);
eventRouter.post('/add-default',createDefault);

export default eventRouter;