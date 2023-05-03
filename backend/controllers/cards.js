
const Card = require('../models/card');

const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden');

const { CREATED } = require('../utils/statuses');



const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next); // equivalent to .catch(err=>next(err));
};


const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED).send(card);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Data not valid'));
      } else {
        next(err);
      }
    });
};


const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => new NotFoundError('No card found with that Id'))

    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        return card.remove(() => {
          res.send(card);
        });
      }
      throw new ForbiddenError('You do not have rights to delete card');
    })

    .catch(next);
};


const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('No card found with that Id'))

    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => new NotFoundError('No card found with that Id'))

    .then((card) => {
      res.send(card);
    })
    .catch(next);
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
