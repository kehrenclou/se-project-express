// backend/controllers/users.js
/* --------------------------------- imports -------------------------------- */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
//this needs to be active for server
const { NODE_ENV, JWT_SECRET } = process.env;
// const JWT_SECRET = require("../utils/config");
const jwtSecret = require("../utils/config");

// const { BadRequestError, NotFoundError,  ConflictError } = require("../errors");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const ConflictError = require("../errors/conflict");
const UnauthorizedError = require("../errors/unauthorized");

const { SUCCESSFUL, CREATED } = require("../utils/statuses");

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------- send User Profile ---------------------------- */
const sendUserProfile = (req, res, next) => {
  // const { userId } = req.params;
  // const userId = req.user._id;

  User.findById({ _id: req.user._id })
    .orFail(() => {
      new NotFoundError("No user found by that Id");
    })
    .then((user) => {
      res.status(SUCCESSFUL).send(user);
    })

    .catch(next); //equivalent to .catch(err=>next(err));
};

/* ----------------------------- create New User ---------------------------- */
const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10, (err, hash) => {
    console.log("calledcreateUser bend");

    return User.findOne({ email }).then((user) => {
      if (user) {
        return next(new ConflictError("User with this email already exists"));
      }
      return User.create({ ...req.body, password: hash })
        .then((data) => {
          return res.status(CREATED).send(data);
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            new BadRequestError("Data is Invalid");
          } else {
            next(err);
          }
        });
    });
  });
};

/* ------------------------------- login User ------------------------------- */
//gets the email and password from the request and authenticates them
//only user id should be written to the token payload
//once token created, send to client in response body
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      //authentication succesful user is in the variable
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : jwtSecret,
        {
          expiresIn: "7d",
        }
      );

      return res.status(SUCCESSFUL).send({ token: token });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

// /* --------------------------- update User Profile -------------------------- */
const updateUserProfile = (req, res, next) => {
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
      new NotFoundError("No user found with that Id");
    })
    .then((user) => {
      if (!user) {
        return new NotFoundError("No user found with that Id");
      }
      res.status(SUCCESSFUL).send(user);
      // res.status(SUCCESSFUL).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid User Id"));
      } else {
        next(err);
      }
    });
};

/* ------------------------------ update Avatar ----------------------------- */
const updateUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      new NotFoundError("No user found by that Id");
    })
    .then((user) => {
      // res.status(SUCCESSFUL).send({ data: user });
      res.status(SUCCESSFUL).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        new BadRequestError("Data is Invalid");
      } else {
        next(err);
      }
    });
};

/* --------------------------------- exports -------------------------------- */
module.exports = {
  // getUsers,
  sendUserProfile,
  createUser,
  loginUser,
  updateUserProfile,
  updateUserAvatar,
};
