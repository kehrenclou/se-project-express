//backend/middlewares/auth.js
/* --------------------------------- imports -------------------------------- */
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized");

const JWT_SECRET = require("../utils/config");

/* ---------------------------------- auth ---------------------------------- */

//verify token from headers
//if token ok, middleware should add token payload to the user object and call next()
// const handleAuthError = (res) => {
//   res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
// };

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized");
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError("Unauthorized");
  }

  req.user = payload; //asign payload to request object
  next(); //goes to next middleware
};

/* --------------------------------- exports -------------------------------- */
