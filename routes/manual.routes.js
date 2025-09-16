import express from "express";
import { createManualCompetition, getNextCompetitionId, getManualComeptitionList, updateCompetitionStatus } from "../controller/manualCompetition.controller.js";
import { createManualEvent } from "../controller/manualEvent.controller.js";
const manualRouter = express.Router();

manualRouter.post('/add-competition',createManualCompetition);
manualRouter.post('/next-competition-id', getNextCompetitionId);
manualRouter.post('/add-event',createManualEvent);
manualRouter.post('/get-manual-competition',getManualComeptitionList);
manualRouter.post('/update-manual-competition',updateCompetitionStatus);

export default manualRouter;