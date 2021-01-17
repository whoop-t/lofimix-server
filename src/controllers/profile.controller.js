const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { profileService } = require('../services');
const { generateSignedURL } = require('../middlewares/uploadFile');

const getProfile = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['id']);
  const results = await profileService.queryProfile(filter);
  res.send({ results });
});

module.exports = {
  getProfile,
};
