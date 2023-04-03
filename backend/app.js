// backend/app.js
/* --------------------------------- imports -------------------------------- */
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
// const rateLimit = require("express-rate-limit");
const { limiter } = require("./utils/rate-limit-config");
// const path = require('path');
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { createUser, loginUser } = require("./controllers/users");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const auth = require("./middlewares/auth");
const {
  validateUserBody,
  validateLoginBody,
} = require("./middlewares/validation");
const { NotFoundError } = require("./errors/not-found");
const errorHandler = require("./middlewares/error-handler");

/* -------------------------- declare app and port -------------------------- */
/* ------------------------------ connect to DB ----------------------------- */
const app = express();
// QUESTION:when is base path necessary
const { PORT = 3000 } = process.env;

// mongoose.connect("mongodb://localhost:27017/aroundb");//older node versions
mongoose.connect("mongodb://127.0.0.1/aroundb");

/* -------------------------------- app -------------------------------- */
// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(helmet());
app.use(cors());
app.options("*", cors()); // enable requests for all routes
// app.use(express.static(path.join(__dirname, 'public')));//use for static files

app.use(express.json()); // for versions express 4.16+ can use this instead of bodyparser
app.use(express.urlencoded({ extended: false }));

app.use(requestLogger);

// crash test - remove after review paases
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// routes
app.post("/signup", validateUserBody, createUser);
app.post("/signin", validateLoginBody, loginUser);

app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);

// check if this is ok for 404 route
app.use((req, res, next) => {
  next(new NotFoundError("This route does not exist"));
});

app.use(errorLogger); // winston
app.use(errors()); // celebrate
app.use(errorHandler); // centralized error handler

app.listen(PORT, () => {
  console.log(` App listening at port ${PORT}`);
});
