const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

function validateUrl(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

// used on LogIn User
// app.post('/signin', validateLoginBody, loginUser);
const validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email',
      'string.required': 'The email field must be filled in',
    }),
    password: Joi.string().required().messages({
      'string.required': 'The password field must be filled in',
    }),
  }),
});

// used on creating User
// app.post('/signup', validateUserBody, createUser);
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Jaques Cousteau').min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "name" field is 2',
        'string.max': 'The maximum length of the "name" field is 30',
      }),
    about: Joi.string().default('Explorer').min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "about" field is 2',
        'string.max': 'The maximum length of the "about" field is 30',
      }),
    avatar: Joi.string()
      .default('https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg')
      .custom(validateUrl)
      .messages({ 'string.url': 'the avatar url must be a valid url' }),

    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email',
      'string.required': 'The email field must be filled in',
    }),
    password: Joi.string().required().messages({
      'string.required': 'The password field must be filled in',
    }),
  }),
});

// used for updating Profile
// router.patch('/me', validateUpdateProfileBody, updateUserProfile);
const validateUpdateProfileBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Jaques Cousteau').min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "name" field is 2',
        'string.max': 'The maximum length of the "name" field is 30',
      }),
    about: Joi.string().default('Explorer').min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "about" field is 2',
        'string.max': 'The maximum length of the "about" field is 30',
      }),
  }),
});

// used for updating Avatar
// router.patch('/me/avatar',validateUpdateAvatarBody,updateUserAvatar)
const validateUpdateAvatarBody = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl).messages({
      'string.url': 'The avatar url must be a valid url',
      'string.empty': 'The avatar field must not be empty',
    }),
  }),
});

// used for creating Card
// router.post('/', validateCardBody, createCard);

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.empty': 'The name field must be filled in',
        'string.min': 'The minimum length of the "name" field is 2',
        'string.max': 'The maximum length of the "name" field is 30',
      }),
    link: Joi.string().required().custom(validateUrl).messages({
      'string.url': 'The link must be a valid url',
      'string.empty': "The 'link'field must be filled in",
    }),
  }),
});

const validateCardId = celebrate({
  body: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});
module.exports = {
  validateUserBody,
  validateLoginBody,
  validateUpdateProfileBody,
  validateUpdateAvatarBody,
  validateCardBody,
  validateCardId,
};
