const Joi = require("joi");

export const loginSchema = Joi.object({
  user: Joi.string().required(),
  password: Joi.string().required(),
});
