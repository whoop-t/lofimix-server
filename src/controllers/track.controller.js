const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { trackService, userService } = require('../services');
const { generateSignedURL, addImageSignedUrl, generateSignedURLImage } = require('../middlewares/uploadFile');

// TODO User is added to req after auth, use to populate uploader
const createTrack = catchAsync(async (req, res) => {
  const track = await trackService.createTrack(req.body);
  // Update uploads array by inserting track ref
  const user = await userService.getUserByIdAndUpdateTrackRef(track.uploader.uploaderId, track.id);
  // get signed key for new track
  track['signedURL'] = await generateSignedURL(track.fileKey);
  track['coverURL'] = await generateSignedURLImage(track.coverKey, 'coversBucket');
  res.status(httpStatus.CREATED).send(track);
});

const getTracks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['tags']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const queryResults = await trackService.queryTracks(filter, options);
  // Loop through results and find corresponding s3 images.
  const resultsPromise = addImageSignedUrl(queryResults.results);
  // Wait for s3 promises to resolve
  const results = await Promise.all(resultsPromise);
  res.send({
    tracks: {
      results,
      page: queryResults.page,
      limit: queryResults.limit,
      totalPages: queryResults.totalPages,
      totalResults: queryResults.totalResults,
    },
  });
});

const playTrack = catchAsync(async (req, res) => {
  const { fileKey } = pick(req.query, ['fileKey']);
  const signedURL = await generateSignedURL(fileKey);
  res.send({ signedURL });
});

const getTags = catchAsync(async (req, res) => {
  const results = await trackService.queryTags();
  const tags = results[0].tags;
  res.send({ tags });
});

module.exports = {
  createTrack,
  getTracks,
  playTrack,
  getTags,
};
