//backend/app.js
/* --------------------------------- imports -------------------------------- */
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { createUser, loginUser } = require("./controllers/users");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const auth = require("./middlewares/auth");
const {
  validateUserBody,
  validateLoginBody,
} = require("./middlewares/validation");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");

/* -------------------------- declare app and port -------------------------- */
/* ------------------------------ connect to DB ----------------------------- */
const app = express();
//when is base path necessary
const { PORT = 3000, BASE_PATH } = process.env;
// const { PORT = 3000 } = process.env;

// mongoose.connect("mongodb://localhost:27017/aroundb");//older node versions
mongoose.connect("mongodb://127.0.0.1/aroundb");
// do we need options here?//
/* -------------------------------- app -------------------------------- */

app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json()); //for versions express 4.16+ can use this instead of bodyparser
app.use(express.urlencoded({ extended: false }));

app.use(requestLogger);

//routes
app.post("/signup", validateUserBody, createUser);
app.post("/signin", validateLoginBody, loginUser);

app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);

app.use(errorLogger); //winston
app.use(errors()); //celebrate
app.use(errorHandler); //centralized error handler

app.listen(PORT, () => {
  console.log(` App listening at port ${PORT}`);
});
