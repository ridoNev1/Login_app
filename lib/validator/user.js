const Joi = require("joi");

export const regSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .min(5)
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  username: Joi.string().min(5).required(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")),
});
