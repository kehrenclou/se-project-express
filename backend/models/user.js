// models/user.js
/* --------------------------------- imports -------------------------------- */
const mongoose = require('mongoose');
const { urlRegExp } = require('../utils/regex');

/* --------------------------------- Schema --------------------------------- */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name field must be filled in'],
    minlength: [2, 'The minimum length of the name field is 2'],
    maxlength: [30, 'The maximum length of the name field is 30'],
  },
  about: {
    type: String,
    required: [true, 'The about  field must be filled in'],
    minlength: [2, 'The minimum length of the about field is 2'],
    maxlength: [30, 'The maximum length of the about  field is 30'],
  },
  avatar: {
    type: String,
    required: [true, 'The avatar field must be filled in'],
    validate: {
      validator(value) {
        return urlRegExp.test(value);
      },
      message: 'Please enter a valid url.',
    },
  },
});

/* ------------------------------ export Model ------------------------------ */
module.exports = mongoose.model('user', userSchema);
