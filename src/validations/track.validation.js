const Joi = require('joi');

const createTrack = {
  body: Joi.object().keys({
    uploader: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    file: Joi.string().required(),
    art: Joi.string().required(),
    flaggedForCopyright: Joi.boolean(),
    tags: Joi.array().required(),
  }),
};

module.exports = {
  createTrack,
};
