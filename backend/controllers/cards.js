// controllers/cards.js
/* --------------------------------- imports -------------------------------- */

const Card = require('../models/card');
const {
  SUCCESSFUL,
  CREATED,
  VALIDATION__ERROR,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');
/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
/* ------------------------------ get all Cards ----------------------------- */
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCESSFUL).send(cards))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server' }));
};

/* ----------------------------- create new Card ---------------------------- */
const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION__ERROR).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Server unable to create card' });
      }
    });
};

/* ------------------------------- delete Card ------------------------------ */
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const error = new Error('No card found with that Id');
      error.statusCode = NOT_FOUND;
      throw error;
    })

    .then((card) => {
      res.status(SUCCESSFUL).send({ data: card });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION__ERROR).send({
          message: 'Invalid Card Id',
        });
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

/* -------------------------------- card Like ------------------------------- */

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No card found with that Id');
      error.statusCode = NOT_FOUND;
      throw error;
    })

    .then((card) => {
      res.status(SUCCESSFUL).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION__ERROR).send({
          message: 'Invalid Card Id',
        });
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

/* ------------------------------- card unlike ------------------------------ */
const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      const error = new Error('No card found with that Id');
      error.statusCode = NOT_FOUND;
      throw error;
    })

    .then((card) => {
      res.status(SUCCESSFUL).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION__ERROR).send({
          message: 'Invalid Card Id',
        });
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};
/* --------------------------------- exports -------------------------------- */
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
