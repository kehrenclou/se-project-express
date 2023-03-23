// backend/routes/users.js
/* --------------------------------- imports -------------------------------- */
const router = require("express").Router();
const {
  getUsers,
  sendUserProfile,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

const {
  validateUpdateProfileBody,
  validateUserBody,
} = require("../middlewares/validation");
/* --------------------------------- routes --------------------------------- */
// router.get("", getUsers);
// router.get("/:userId", sendUserProfile);//is this neededanymore?
router.post('/signup', createUser);
router.get("/me", sendUserProfile);
router.patch("/me", validateUpdateProfileBody, updateUserProfile);
router.patch("/me/avatar", updateUserAvatar);

/* --------------------------------- exports -------------------------------- */
module.exports = router;
