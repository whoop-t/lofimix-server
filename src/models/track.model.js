const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const trackSchema = mongoose.Schema(
  {
    uploader: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
      type: String,
      required: true,
    },
    art: {
      type: String,
    },
    flaggedForCopyright: {
      type: String,
      default: false,
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
