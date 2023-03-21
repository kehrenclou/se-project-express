// app.js
/* --------------------------------- imports -------------------------------- */
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

/* -------------------------- declare app and port -------------------------- */
/* ------------------------------ connect to DB ----------------------------- */
const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');
// do we need options here?//
/* -------------------------------- app -------------------------------- */

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '63288fbe011f1c3bb40a0989',
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(` App listening at port ${PORT}`);
});
