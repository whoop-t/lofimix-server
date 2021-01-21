const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const tagsSchema = mongoose.Schema({
  tags: {
    type: Array,
    required: true,
  },
});

// add plugin that converts mongoose to json
tagsSchema.plugin(toJSON);
tagsSchema.plugin(paginate);

/**
 * @typedef Track
 */
const Tags = mongoose.model('Tags', tagsSchema);

module.exports = Tags;
