const Joi = require('joi');

const createTrack = {
  body: Joi.object().keys({
    user: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    file: Joi.string().required(),
    art: Joi.string(),
  }),
};

module.exports = {
  createTrack,
};
