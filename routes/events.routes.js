import express from "express";
import { addEventController, addSingleMarket, removeSingleMarket, getCompetitionList, updateComeptitionGrade, deleteCompetition, updateEventGrade, deleteEvent, removeEvent, updateCompetitionMarket, updateEventMarket, getSavedEventBySportId, rollBackEvent, isCompetitionExist } from "../controller/event.controller.js";
import { createDefault, updateSingleDefault, getDefault } from "../controller/default-setting.controller.js";
const eventRouter = express.Router();

eventRouter.post('/add',addEventController);
eventRouter.post('/add-default',createDefault);
eventRouter.post('/update-default', updateSingleDefault);
eventRouter.post('/get-default', getDefault);
eventRouter.post('/add-market', addSingleMarket);
eventRouter.post('/remove-market', removeSingleMarket);
eventRouter.post('/get-competition', getCompetitionList);
eventRouter.post('/update-competition-grade', updateComeptitionGrade);
eventRouter.post('/remove-competition', deleteCompetition);
eventRouter.post('/update-event-grade', updateEventGrade);
eventRouter.post('/remove-event', deleteEvent);
eventRouter.post('/partialy-remove-event', removeEvent);
eventRouter.post('/update-competition-market', updateCompetitionMarket);
eventRouter.post('/update-event-market', updateEventMarket);
eventRouter.post('/get-saved-event', getSavedEventBySportId);
eventRouter.post('/rollback-event', rollBackEvent);
eventRouter.post('/competition-check',isCompetitionExist);

export default eventRouter;