//backend/middlewares/auth.js
/* --------------------------------- imports -------------------------------- */
const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/statuses");
const JWT_SECRET = require("../utils/config");

/* ---------------------------------- auth ---------------------------------- */

//verify token from headers
//if token ok, middleware should add token payload to the user object and call next()
const handleAuthError = (res) => {
  res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  console.log("modexport called bend auth");
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; //asign payload to request object
  next(); //goes to next middleware
};

/* --------------------------------- exports -------------------------------- */
