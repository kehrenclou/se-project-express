// routes/cards.js
/* --------------------------------- imports -------------------------------- */
const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const { validateCardBody } = require("../middlewares/validation");
/* --------------------------------- routes --------------------------------- */
router.get("/", getCards);
router.post("/", validateCardBody, createCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);
/* --------------------------------- exports -------------------------------- */
module.exports = router;
