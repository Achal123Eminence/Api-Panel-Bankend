import Joi from "joi";

export const createManualEventValidation = Joi.object({
  competitionId: Joi.number().required(),
  competitionName: Joi.string().required(),
  competitionGrade: Joi.string().valid("A", "B","C").required(),
  sportId: Joi.string().required(),
  eventId: Joi.number().required(),
  eventName: Joi.string().required(),
  marketId: Joi.string().required(),
  eventType: Joi.string().valid("manual", "virtual").required(),
  openDate: Joi.date().required(),
}).unknown(true);
