import express from "express";
import { addEventController } from "../controller/event.controller.js";
import { createDefault, updateSingleDefault, getDefault } from "../controller/default-setting.controller.js";
const eventRouter = express.Router();

eventRouter.post('/add',addEventController);
eventRouter.post('/add-default',createDefault);
eventRouter.post('/update-default', updateSingleDefault);
eventRouter.post('/get-default', getDefault);

export default eventRouter;