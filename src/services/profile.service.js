const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteOldAvatarFromS3 } = require('../middlewares/uploadFile');

/**
 * Query for Profile
 */
const queryProfile = async ({ id }) => {
  const profile = await User.findById(id, '-password -email').populate('uploads').populate('favorites');
  return profile;
};
/**
 * Query for Profile and update it
 */
const queryProfileAndEdit = async (id, body) => {
  // TODO need to create model and validate fields. Client is validating but need to check here as well
  const user = await User.findById(id, '-password -email -role -uploads -favorites -displayName');
  // Loop body and save to doc if there is content
  for (const field in body) {
    // If field was entered, change it
    if (body[field] !== '' || body[field] !== null) {
      // IF there was an avatarKey on profile, go delete the file in s3
      if (field === 'avatarKey' && user.profile[field]) {
        console.log(user.profile[field]);
        // Delete old avatar from bucket
        await deleteOldAvatarFromS3(user.profile[field]);
      }
      user.profile[field] = body[field];
    }
  }
  user.save();
  return user.profile;
};

module.exports = {
  queryProfile,
  queryProfileAndEdit,
};
