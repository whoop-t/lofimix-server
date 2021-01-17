const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService } = require('../services');

const saveFavorite = async (id, trackId) => {
  const favorites = await userService.getUserByIdAndUpdateFavorites({ _id: id }, trackId);
  return favorites;
};
const deleteFavorite = async (id, trackId) => {
  const favorites = await userService.getUserByIdAndDeleteFavorite({ _id: id }, trackId);
  return favorites;
};

module.exports = {
  saveFavorite,
  deleteFavorite,
};
