const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  isActive: Joi.boolean().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  emailAdress: Joi.string().email().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().pattern(/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9])((\s|\s?-\s?)?[0-9])((\s|\s?-\s?)?[0-9])\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]$/).required()
});

module.exports = userSchema;