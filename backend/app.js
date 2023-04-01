//backend/app.js
/* --------------------------------- imports -------------------------------- */
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const { createUser, loginUser } = require("./controllers/users");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const auth = require("./middlewares/auth");
const {
  validateUserBody,
  validateLoginBody,
} = require("./middlewares/validation");
const { errors } = require("celebrate");

/* -------------------------- declare app and port -------------------------- */
/* ------------------------------ connect to DB ----------------------------- */
const app = express();

const { PORT = 3000, BASE_PATH } = process.env;
// const { PORT = 3000 } = process.env;

// mongoose.connect("mongodb://localhost:27017/aroundb");
mongoose.connect("mongodb://127.0.0.1/aroundb");
// do we need options here?//
/* -------------------------------- app -------------------------------- */

app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   req.user = {
//     _id: "63288fbe011f1c3bb40a0989",
//   };
//   next();
// });

app.use(express.json()); //for versions express 4.16+ can use this instead of bodyparser
app.use(express.urlencoded({ extended: false }));

// app.post(`{BASE_PATH}/signup`, validateUserBody, createUser);
// app.use("/signup", validateUserBody, createUser);
app.post("/signup", validateUserBody, createUser);
app.post("/signin", validateLoginBody, loginUser);

app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);

app.use(errors());

//question: will this still be needed if centralized error handling?
// app.use((req, res) => {
//   res.status(404).send({ message: "Requested resource not found" });
// });

app.use((err, req, res, next) => {
  //this is the error handler
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});
app.listen(PORT, () => {
  console.log(` App listening at port ${PORT}`);
});
