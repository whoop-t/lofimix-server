const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for Profile
 */
const queryProfile = async ({ id }) => {
  const profile = await User.findById(id).populate('uploads');
  return profile;
};

module.exports = {
  queryProfile,
};
