const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { regularUrl } = require('../utils/regularExpressions');
const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/user');

// Получить всех пользователей
router.get('', getUsers);

// Получить авторизированного пользователя
router.get('/me', getUserInfo);

// Получение пользователя по id
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

// Обновление профиля
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

// Обновление аватара
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regularUrl),
  }),
}), updateAvatar);

module.exports = router;
