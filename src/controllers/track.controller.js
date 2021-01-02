const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { trackService } = require('../services');

// TODO User is added to req after auth, use to populate uploader
const createTrack = catchAsync(async (req, res) => {
  const track = await trackService.createTrack(req.body);
  res.status(httpStatus.CREATED).send(track);
});

const getTracks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['tags']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await trackService.queryTracks(filter, options);
  res.send(result);
});

module.exports = {
  createTrack,
  getTracks,
};
