const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/user');
const { regularUrl } = require('../utils/regularExpressions')

// Авторизация
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(2).max(30).required(),
  }),
}), login);

// Регистрация
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regularUrl),
    email: Joi.string().required().email(),
    password: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

module.exports = router;
