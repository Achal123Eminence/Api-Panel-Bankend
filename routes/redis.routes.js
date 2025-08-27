import express from "express";
const redisRouter = express.Router();
import { redisCompetitionList, redisAllEventData, redisEventList, redisMarketList, redisMarketBook } from "../controller/redis-sport.controller.js";

redisRouter.get('/competition/:sportId',redisCompetitionList);
redisRouter.get('/event/:competitionId',redisEventList);
redisRouter.get('/market/:eventId',redisMarketList);
redisRouter.get('/book/:marketId',redisMarketBook);
redisRouter.get('/all-event/:sportId', redisAllEventData)

export default redisRouter