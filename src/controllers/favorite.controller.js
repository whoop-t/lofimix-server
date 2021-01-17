const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { favoriteService } = require('../services');

const saveFavorite = catchAsync(async (req, res) => {
  const { favorites } = await favoriteService.saveFavorite(req.user._id, req.body.trackId);
  // return just the updated favorites
  res.status(httpStatus.CREATED).send({ favorites });
});

const deleteFavorite = catchAsync(async (req, res) => {
  const { favorites } = await favoriteService.deleteFavorite(req.user._id, req.body.trackId);
  // return just the updated favorites
  res.status(httpStatus.CREATED).send({ favorites });
});

const getFavorites = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['id']);
  const results = await profileService.queryProfile(filter);
  res.send({ results });
});

module.exports = {
  getFavorites,
  saveFavorite,
  deleteFavorite,
};
