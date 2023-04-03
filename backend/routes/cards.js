// routes/cards.js
/* --------------------------------- imports -------------------------------- */
const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCardBody,
  validateCardId,
} = require('../middlewares/validation');
/* --------------------------------- routes --------------------------------- */
router.get('/', getCards);
router.post('/', createCard);

router.post('/', validateCardBody, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);
/* --------------------------------- exports -------------------------------- */
module.exports = router;
