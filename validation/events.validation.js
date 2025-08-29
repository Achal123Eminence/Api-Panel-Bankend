// validations/event.validation.js
import Joi from "joi";

const runnerSchema = Joi.object({
  selectionId: Joi.number().required(),
  runnerName: Joi.string().required(),
  handicap: Joi.number().default(0),
  sortPriority: Joi.number()
});

const marketSchema = Joi.object({
  marketId: Joi.string().required(),
  marketName: Joi.string().required(),
  runners: Joi.array().items(runnerSchema),
  isAdded: Joi.boolean().default(false)
});

export const eventValidation = Joi.object({
  eventId: Joi.string().required(),
  eventName: Joi.string().required(),
  competitionName: Joi.string().allow(""),
  competitionId: Joi.string().required(),
  sportId: Joi.string().required(),
  sportName: Joi.string().required(),
  markets: Joi.array().items(marketSchema),
  marketName: Joi.string(),
  marketId: Joi.string(),
  openDate: Joi.date(),
  matchRunners: Joi.array().items(runnerSchema),
  marketCount: Joi.number().default(0),
  totalMatched: Joi.alternatives().try(Joi.number(),Joi.string().allow("")).default(""),
  isAdded: Joi.boolean().default(false)
});
