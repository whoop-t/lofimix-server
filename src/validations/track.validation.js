const Joi = require('joi');

const createTrack = {
  body: Joi.object().keys({
    uploader: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    fileKey: Joi.string().required(),
    signedURL: Joi.string(),
    flaggedForCopyright: Joi.boolean(),
    views: Joi.number(),
    tags: Joi.string().required(),
  }),
};

module.exports = {
  createTrack,
};
