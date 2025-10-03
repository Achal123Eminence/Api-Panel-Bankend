import Joi from "joi";

export const getEventListValidation = (data) => {
  const schema = Joi.object({
    sportId: Joi.string().required().messages({
      "string.empty": "sportId is required",
      "any.required": "sportId is required"
    })
  }).unknown(true);

  return schema.validate(data);
};

export const getMarketListValidation = (data) => {
  const schema = Joi.object({
    eventId: Joi.string().required().messages({
      "string.empty": "eventId is required",
      "any.required": "eventId is required"
    })
  }).unknown(true);

  return schema.validate(data);
};

export const updateEventMarketValidation = (data) => {
  const schema = Joi.object({
    eventId: Joi.string().required().messages({
      "any.required": "eventId is required"
    }),
    marketId: Joi.string().required().messages({
      "any.required": "marketId is required"
    }),
    status: Joi.boolean().required().messages({
      "any.required": "status is required"
    })
  }).unknown(true);

  return schema.validate(data);
};

export const updateEventPremiumAndMatchtypeValidation = (data) => {
  const schema = Joi.object({
    eventId: Joi.string().required().messages({
      "any.required": "eventId is required",
    }),
    premium: Joi.boolean().required().messages({
      "any.required": "premium is required",
    }),
    matchType: Joi.string().required().messages({
      "any.required": "matchType is required",
    }),
  }).unknown(true);

  return schema.validate(data);
};

export const updateEventOpenDateValidation = (data) => {
  const schema = Joi.object({
    eventId: Joi.string().required().messages({
      "any.required": "eventId is required",
    }),
    openDate: Joi.date().required().messages({
      "any.required": "premium is required",
    }),
  }).unknown(true);

  return schema.validate(data);
};


export const updateEventRunnersValidation = Joi.object({
  eventId: Joi.string().required().messages({
    "any.required": "EventId is required",
    "string.base": "EventId must be a string"
  }),
  runners: Joi.array()
    .items(
      Joi.object({
        selectionId: Joi.number().required(),
        runnerName: Joi.string().required(),
        handicap: Joi.number().optional(),
        sortPriority: Joi.number().optional(),
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "Runners list is required",
      "array.base": "Runners must be an array",
    }),
}).unknown(true);
