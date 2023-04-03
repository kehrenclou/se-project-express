// backend/controllers/users.js
/* --------------------------------- imports -------------------------------- */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env; // secret saved on server in .env file

const jwtSecret = require("../utils/config"); // local secret for dev

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
  User.findById({ _id: req.user._id })
    .orFail(() => new NotFoundError("No user found by that Id"))
    .then((user) => {
      res.status(SUCCESSFUL).send(user);
    })

    .catch(next); // equivalent to .catch(err=>next(err));
};

/* ----------------------------- create New User ---------------------------- */
const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  // return bcrypt.hash(password, 10, (err, hash) =>
  User.findOne({ email }).then((user) => {
    if (user) {
      return next(new ConflictError("User with this email already exists"));
    }
    // return
    bcrypt
      .hash(password, 10)
      .then((hash) => User.create({ ...req.body, password: hash }))
      .then((data) => {
        res.status(CREATED).send({
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          email: data.email,
        });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BadRequestError("Data is Invalid"));
        } else {
          next(err);
        }
      });
  });
};

// const createUser = (req, res, next) => {
//   const { name, about, avatar, email, password } = req.body;

//   return bcrypt.hash(password, 10, (err, hash) =>
//     User.findOne({ email }).then((user) => {
//       if (user) {
//         return next(new ConflictError("User with this email already exists"));
//       }
//       return User.create({ ...req.body, password: hash })
//         .then((data) =>
//           res.status(CREATED).send({
//             name: data.name,
//             about: data.about,
//             avatar: data.avatar,
//             email: data.email,
//           })
//         )
//         .catch((err) => {
//           if (err.name === "ValidationError") {
//             next(new BadRequestError("Data is Invalid"));
//           } else {
//             next(err);
//           }
//         });
//     })
//   );
// };
/* ------------------------------- login User ------------------------------- */
// gets the email and password from the request and authenticates them
// only user id should be written to the token payload
// once token created, send to client in response body
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication succesful user is in the variable
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : jwtSecret,
        {
          expiresIn: "7d",
        }
      );

      return res.status(SUCCESSFUL).send({ token });
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
      runValidators: true, // data will be validated before the update
      new: true, // the then handler receives the updated entry as input
    }
  )
    .orFail(() => new NotFoundError("No user found with that Id"))
    .then((user) => res.send(user))
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
    .orFail(() => new NotFoundError("No user found by that Id"))
    .then((user) => {
      // res.status(SUCCESSFUL).send({ data: user });
      res.status(SUCCESSFUL).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        next(new BadRequestError("Data is Invalid"));
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
