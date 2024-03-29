const Joi = require('joi');

const createTrack = {
  body: Joi.object().keys({
    uploader: Joi.object().required(),
    title: Joi.string().required(),
    artist: Joi.string(),
    fileKey: Joi.string().required(),
    coverKey: Joi.string().required(),
    flaggedForCopyright: Joi.boolean(),
    signedURL: Joi.string(),
    coverURL: Joi.string(),
    plays: Joi.number(),
    downloads: Joi.number(),
    tags: Joi.array().required(),
  }),
};

module.exports = {
  createTrack,
};
