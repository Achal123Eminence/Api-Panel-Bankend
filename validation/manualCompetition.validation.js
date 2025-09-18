import Joi from "joi";

export const createManualCompetitionValidation = Joi.object({
  competitionName: Joi.string().required(),
  sportId: Joi.string().required(),
  competitionType: Joi.string().valid("manual", "virtual").required(),
  openDate: Joi.date().required(),
}).unknown(true);
