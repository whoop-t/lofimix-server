const Joi = require('joi');

const contactUs = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

module.exports = {
  contactUs,
};
