const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const profileSchema = {
  body: Joi.object().keys({
    description: Joi.string(),
    twitter: Joi.string(),
    youtube: Joi.string(),
    soundcloud: Joi.string(),
    instagram: Joi.string(),
    spotify: Joi.string(),
  }),
};
const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    diaplyName: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
    profile: Joi.object(profileSchema).required(),
    uploads: Joi.array().required(),
    favorites: Joi.array().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
