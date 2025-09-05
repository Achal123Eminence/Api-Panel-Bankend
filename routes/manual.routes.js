import express from "express";
import { createManualCompetition, getNextCompetitionId } from "../controller/manualCompetition.controller.js";
import { createManualEvent } from "../controller/manualEvent.controller.js";
const manualRouter = express.Router();

manualRouter.post('/add-competition',createManualCompetition);
manualRouter.post('/next-competition-id', getNextCompetitionId);
manualRouter.post('/add-event',createManualEvent);

export default manualRouter;