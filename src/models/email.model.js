const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const emailSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// add plugin that converts mongoose to json
emailSchema.plugin(toJSON);

/**
 * @typedef Track
 */
const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
