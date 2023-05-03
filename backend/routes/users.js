const router = require('express').Router();
const {
  sendUserProfile,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

const {
  validateUpdateProfileBody,
  validateUpdateAvatarBody,
} = require('../middlewares/validation');

router.get('/me', sendUserProfile);
router.patch('/me', validateUpdateProfileBody, updateUserProfile);
router.patch('/me/avatar', validateUpdateAvatarBody, updateUserAvatar);

module.exports = router;
