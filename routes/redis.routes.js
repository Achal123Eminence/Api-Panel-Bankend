import express from "express";
const redisRouter = express.Router();
import { redisCompetitionList, redisAllEventData, redisEventList, redisMarketList, redisMarketBook } from "../controller/redis-sport.controller.js";

redisRouter.post('/competition',redisCompetitionList);
redisRouter.post('/event',redisEventList);
redisRouter.post('/market',redisMarketList);
redisRouter.post('/book',redisMarketBook);
redisRouter.post('/all-event', redisAllEventData)

export default redisRouter