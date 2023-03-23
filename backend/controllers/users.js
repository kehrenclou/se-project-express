// backend/controllers/users.js
/* --------------------------------- imports -------------------------------- */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = require("../utils/config");

const {
  SUCCESSFUL,
  CREATED,
  VALIDATION__ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */

/* ------------------------------ get All Users ----------------------------- */
const getUsers = (req, res) =>
  User.find({})

    .then((users) => res.status(SUCCESSFUL).send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" })
    );

/* ---------------------------- send User Profile ---------------------------- */
const sendUserProfile = (req, res) => {
  // const { userId } = req.params;
  // const userId = req.user._id;

  User.findById({ _id: req.user._id })
    .orFail(() => {
      const error = new Error("No user found by that Id");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(SUCCESSFUL).send(user);
      // res.status(SUCCESSFUL).send({ data: user });
    })

    .catch((err) => {
      if (err.name === "CastError") {
        res.status(VALIDATION__ERROR).send({
          message: "xInvalid User Id why isnt this working",
        });
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

/* ----------------------------- create New User ---------------------------- */
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10, (err, hash) => {
    console.log("called");
    return User.findOne({ email }).then((user) => {
      if (user) {
        return res
          .status(FORBIDDEN)
          .send({ message: "User with this email already exists" });
      }
      return User.create({ ...req.body, password: hash })
        .then((data) => {
          return res.status(CREATED).send(data);
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            res.status(VALIDATION__ERROR).send({
              message: `${Object.values(err.errors)
                .map((error) => error.message)
                .join(", ")}`,
            });
          } else {
            res
              .status(INTERNAL_SERVER_ERROR)
              .send({ message: "Server unable to create user." });
          }
        });
    });
  });
};

/* ------------------------------- login User ------------------------------- */
//gets the email and password from the request and authenticates them
//only user id should be written to the token payload
//once token created, send to client in response body
const loginUser = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      //authentication succesful user is in the variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(SUCCESSFUL).send({token: token} );
    })
    .catch((err) => {
      res
        .status(UNAUTHORIZED)
        .send({ message: "Incorrect email or password1" });
    });
};

// /* --------------------------- update User Profile -------------------------- */
const updateUserProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      runValidators: true, //data will be validated before the update
      new: true, //the then handler receives the updated entry as input
    }
  )
    .orFail(() => {
      const error = new Error("No user found with that Id");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: "No user found with that ID" });
      }
      res.status(SUCCESSFUL).send( user);
      // res.status(SUCCESSFUL).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(VALIDATION__ERROR).send({
          message: "Invalid User Id",
        });
      } else if (err.name === "ValidationError") {
        res.status(VALIDATION__ERROR).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: `Server unable to update user ${err}` });
      }
    });
};

/* ------------------------------ update Avatar ----------------------------- */
const updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      const error = new Error("No user found with that Id");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      // res.status(SUCCESSFUL).send({ data: user });
      res.status(SUCCESSFUL).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(VALIDATION__ERROR).send({
          message: "Invalid User Id",
        });
      } else if (err.name === "ValidationError") {
        res.status(VALIDATION__ERROR).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: `Server unable to update user ${err}` });
      }
    });
};

/* --------------------------------- exports -------------------------------- */
module.exports = {
  getUsers,
  sendUserProfile,
  createUser,
  loginUser,
  updateUserProfile,
  updateUserAvatar,
};
