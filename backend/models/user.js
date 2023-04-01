// backend/models/user.js
/* --------------------------------- imports -------------------------------- */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { urlRegExp } = require("../utils/regex");
const validator = require("validator");
const UnauthorizedError = require("../errors/unauthorized");

/* --------------------------------- Schema --------------------------------- */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Jaques Cousteau",
    // required: [true, "The name field must be filled in"],
    minlength: [2, "The minimum length of the name field is 2"],
    maxlength: [30, "The maximum length of the name field is 30"],
  },
  about: {
    type: String,
    default: "Explorer",
    // required: [true, "The about  field must be filled in"],
    minlength: [2, "The minimum length of the about field is 2"],
    maxlength: [30, "The maximum length of the about  field is 30"],
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    // required: [true, "The avatar field must be filled in"],
    validate: {
      validator(value) {
        return urlRegExp.test(value);
      },
      message: "Please enter a valid url.",
    },
  },
  //add email and password
  email: {
    type: String,
    required: [true, "The email field must be filled in"],
    unique: [true, "This email is already registered."],
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Please enter a valid email.",
    },
  },

  password: {
    type: String,
    required: [true, "The password field must be filled in"],
    select: false,
  },
});
/* -------------------------- findUserByCredentials ------------------------- */
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("password")
    .orFail()
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Incorrect email or password")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Incorrect email or password")
          );
        }

        return user;
      });
    });
};
/* ------------------------------ export Model ------------------------------ */
module.exports = mongoose.model("user", userSchema);
