// controllers/cards.js
/* --------------------------------- imports -------------------------------- */

const Card = require("../models/card");

const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const ForbiddenError = require("../errors/forbidden");

const { SUCCESSFUL, CREATED } = require("../utils/statuses");
/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
/* ------------------------------ get all Cards ----------------------------- */
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(SUCCESSFUL).send(cards))
    .catch(next); //equivalent to .catch(err=>next(err));
};

/* ----------------------------- create new Card ---------------------------- */
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED).send(card);
      // res.status(CREATED).send({ data: card });
    })

    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Data not valid"));
      } else {
        next(err);
      }
    });
};

/* ------------------------------- delete Card ------------------------------ */
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      new NotFoundError("No card found with that Id");
    })

    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        return card.remove(() => {
          res.status(SUCCESSFUL).send(card);
          // res.status(SUCCESSFUL).send({ data: card });
        });
      }
      throw new ForbiddenError("You do not have rights to delete card");
    })

    .catch(next); //equivalent to .catch(err=>next(err));
};

/* -------------------------------- card Like ------------------------------- */

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      new NotFoundError("No card found with that Id");
    })

    .then((card) => {
      res.status(SUCCESSFUL).send(card);
      //  res.status(SUCCESSFUL).send({ data: card });
    })
    .catch(next);
};

/* ------------------------------- card unlike ------------------------------ */
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      new NotFoundError("No card found with that Id");
    })

    .then((card) => {
      // res.status(SUCCESSFUL).send({ data: card });
      res.status(SUCCESSFUL).send(card);
    })
    .catch(next);
};
/* --------------------------------- exports -------------------------------- */
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
