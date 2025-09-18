import Joi from "joi";

export const createUserValidation = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
}).unknown(true); 

export const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  // fingerprint: Joi.string().optional(),
  // components: Joi.object().unknown(true).optional()
}).unknown(true);