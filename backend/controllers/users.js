// controllers/users.js
/* --------------------------------- imports -------------------------------- */

const User = require("../models/user");
const {
  SUCCESSFUL,
  CREATED,
  VALIDATION__ERROR,
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
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("No user found by that Id");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(SUCCESSFUL).send({ data: user });
    })

    .catch((err) => {
      if (err.name === "CastError") {
        res.status(VALIDATION__ERROR).send({
          message: "Invalid User Id",
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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CREATED).send({ data: user });
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
          .send({ message: "Server unable to create user" });
      }
    });
};

/* --------------------------- update User Profile -------------------------- */
const updateUserProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { runValidators: true, new: true }
  )
    .orFail(() => {
      const error = new Error("No user found with that Id");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(SUCCESSFUL).send({ data: user });
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
      res.status(SUCCESSFUL).send({ data: user });
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
  updateUserProfile,
  updateUserAvatar,
};
