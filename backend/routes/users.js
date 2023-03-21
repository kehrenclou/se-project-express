// routes/users.js
/* --------------------------------- imports -------------------------------- */
const router = require('express').Router();
const {
  getUsers,
  sendUserProfile,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

/* --------------------------------- routes --------------------------------- */
router.get('', getUsers);
router.get('/:userId', sendUserProfile);
router.post('/', createUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

/* --------------------------------- exports -------------------------------- */
module.exports = router;
