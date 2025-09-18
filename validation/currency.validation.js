import Joi from "joi";

export const createCurrencyValidation = Joi.object({
  name: Joi.string().required(),
  value: Joi.number().required(),
  isBase: Joi.boolean().default(false)
}).unknown(true);

export const bulkUpdateCurrencyValidation = Joi.object({
  currencies: Joi.array().items(
    Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      value: Joi.number().required(),
      isBase: Joi.boolean().default(false)
    })
  ).min(1).required()
}).unknown(true);

// base update validation
export const updateBaseCurrencyValidation = Joi.object({
  id: Joi.string().required(),    // make sure id is passed
  name: Joi.string().required()
}).unknown(true);