import Joi from "joi";

export const createCurrencyValidation = Joi.object({
  name: Joi.string().required(),
  value: Joi.number().required(),
  isBase: Joi.boolean().default(false)
});

export const bulkUpdateCurrencyValidation = Joi.object({
  currencies: Joi.array().items(
    Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      value: Joi.number().required(),
      isBase: Joi.boolean().default(false)
    })
  ).min(1).required()
});