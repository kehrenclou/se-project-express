// backend/routes/users.js
/* --------------------------------- imports -------------------------------- */
const router = require('express').Router();
const {
  sendUserProfile,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

const { validateUpdateProfileBody } = require('../middlewares/validation');
/* --------------------------------- routes --------------------------------- */

router.get('/me', sendUserProfile);
router.patch('/me', validateUpdateProfileBody, updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

/* --------------------------------- exports -------------------------------- */
module.exports = router;
