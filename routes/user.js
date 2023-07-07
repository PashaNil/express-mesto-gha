const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/user');

// Получить всех пользователей
router.get('', getUsers);

// Получить авторизированного пользователя
router.get('/me', getUserInfo);

// Получение пользователя по id
router.get('/id/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).alphanum().required(),
  }),
}), getUserById);

// Обновление профиля
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

// Обновление аватара
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(7).required(),
  }),
}), updateAvatar);

module.exports = router;
