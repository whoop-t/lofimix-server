const Joi = require('joi');

const createTrack = {
  body: Joi.object().keys({
    uploader: Joi.object().required(),
    title: Joi.string().required(),
    fileKey: Joi.string().required(),
    flaggedForCopyright: Joi.boolean(),
    signedURL: Joi.string(),
    plays: Joi.number(),
    downloads: Joi.number(),
    tags: Joi.string().required(),
  }),
};

module.exports = {
  createTrack,
};
