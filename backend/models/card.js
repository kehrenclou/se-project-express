// models/card.js
/* --------------------------------- imports -------------------------------- */
const mongoose = require('mongoose');
const { urlRegExp } = require('../utils/regex');

/* --------------------------------- Schema --------------------------------- */
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field must be filled in'],
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The maximum length of the "name" field is 30'],
  },

  link: {
    type: String,
    required: [true, 'The "link" field must be filled in'],
    validate: {
      validator(value) {
        return urlRegExp.test(value);
      },
      message: 'Please enter a valid url.',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

/* ------------------------------ export Model ------------------------------ */
module.exports = mongoose.model('card', cardSchema);
