const httpStatus = require('http-status');
const { Track } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a track
 * @param {Object} trackBody
 * @returns {Promise<Track>}
 */
const createTrack = async (trackBody) => {
  const track = await Track.create(trackBody);
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

module.exports = {
  createTrack,
  queryTracks,
};
