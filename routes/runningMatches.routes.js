import express from "express";
const runningMatchesRouter = express.Router();
import { getRunningEventController, getMarketListController, updateEventMarketController, updateEventPremiumAndMatchtypeController, updateEventOpenDateController, updateEventRunnersController } from "../controller/runningMatches.controller.js";

runningMatchesRouter.post('/get-events',getRunningEventController);
runningMatchesRouter.post('/get-markets',getMarketListController);
runningMatchesRouter.post('/update-markets-status',updateEventMarketController);
runningMatchesRouter.post('/update-event-type',updateEventPremiumAndMatchtypeController);
runningMatchesRouter.post('/update-event-open-date',updateEventOpenDateController);
runningMatchesRouter.post('/update-event-runner',updateEventRunnersController);

export default runningMatchesRouter;