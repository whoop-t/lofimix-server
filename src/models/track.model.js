const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const trackSchema = mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      trim: true,
      default: '',
    },
    fileKey: {
      type: String,
      required: true,
    },
    coverKey: {
      type: String,
      required: true,
    },
    flaggedForCopyright: {
      type: String,
      default: false,
    },
    signedURL: {
      type: String,
      default: '',
    },
    coverURL: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
trackSchema.plugin(toJSON);
trackSchema.plugin(paginate);

/**
 * @typedef Track
 */
const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
