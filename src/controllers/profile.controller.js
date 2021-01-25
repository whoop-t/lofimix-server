const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { profileService } = require('../services');
const { addImageSignedUrl, addAvatarSignedUrl } = require('../middlewares/uploadFile');

const getProfile = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['id']);
  const userProfile = await profileService.queryProfile(filter);
  // Take uploads and favs on the user doc and find corresponding images in s3
  const uploadsWithURLPromises = addImageSignedUrl(userProfile.uploads);
  const favsWithURLPromises = addImageSignedUrl(userProfile.favorites);
  if (userProfile.profile['avatarKey'] !== '') {
    userProfile.profile = await addAvatarSignedUrl(userProfile.profile);
  }
  userProfile['uploads'] = await Promise.all(uploadsWithURLPromises);
  userProfile['favorites'] = await Promise.all(favsWithURLPromises);
  // end
  res.send({ results: userProfile });
});

const editProfile = catchAsync(async (req, res) => {
  const userProfile = await profileService.queryProfileAndEdit(req.user._id, req.body);

  res.send({ profile: userProfile });
});

module.exports = {
  getProfile,
  editProfile,
};
