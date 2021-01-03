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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    fileKey: {
      type: String,
      required: true,
    },
    signedURL: {
      type: String,
    },
    flaggedForCopyright: {
      type: String,
      default: false,
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
      type: String,
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
