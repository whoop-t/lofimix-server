const httpStatus = require('http-status');
const { Track, Tags } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a track
 * @param {Object} trackBody
 * @returns {Promise<Track>}
 */
const createTrack = async (trackBody) => {
  const track = await Track.create(trackBody);
  // * Add tags submitted with track to the aggregated tags array
  const tags = await Tags.findOneAndUpdate({}, { $addToSet: { tags: { $each: track.tags } } });
  return track;
};

/**
 * Query for tracks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTracks = async (filter, options) => {
  const tracks = await Track.paginate(filter, options);
  return tracks;
};
const queryTags = async (options) => {
  const tags = await Tags.find({});
  return tags;
};

module.exports = {
  createTrack,
  queryTracks,
  queryTags,
};
