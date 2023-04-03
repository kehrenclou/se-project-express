// vackend/middleware/validation.js
/* --------------------------------- imports -------------------------------- */
const { celebrate, Joi } = require('celebrate');
// const { Joi } = require("joi");
const validator = require('validator');

// allows validate req.params, headers, query as is
// needs body-parser to use req.body
// where does body-parser need to be imported in validation.js or in app.js
// should name, etc be set to .default('valuee') or.optional instead of .required
/* ------------------------ custom validate functions ----------------------- */
function validateUrl(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}
/* -------------------------------------------------------------------------- */
/*                          joi celebrate validation                          */
/* -------------------------------------------------------------------------- */
/* -------------------------- validateLoginBody ------------------------- */
// used on LogIn User
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

/* ---------------------------- validateUserBody ---------------------------- */
// used on creating User
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
      .messages({ 'string.url': 'the avatara url must be a valid url' }),

    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email',
      'string.required': 'The email field must be filled in',
    }),
    password: Joi.string().required().messages({
      'string.required': 'The password field must be filled in',
    }),
  }),
});

/* ------------------------ validateUpdateProfileBody ----------------------- */
// do we need req params here for the userId or just the body?
// used for updating Profile
const validateUpdateProfileBody = celebrate({
  params: Joi.object().keys({
    _id: Joi.string(),
  }),
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

/* --------------------------------- exports -------------------------------- */
module.exports = {
  validateUserBody,
  validateLoginBody,
  validateUpdateProfileBody,
};
