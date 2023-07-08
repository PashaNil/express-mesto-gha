const { celebrate, Joi } = require('celebrate');
const { regularUrl } = require('./regularExpressions');

// Авторизация
const reqRulesLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(2).max(30).required(),
  }),
});

// Регистрация
const reqRulesCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regularUrl),
    email: Joi.string().required().email(),
    password: Joi.string().min(2).max(30).required(),
  }),
});

// Пользователь по id
const reqRulesGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

// Обновление профиля
const reqRulesUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

// Обновление аватара
const reqRulesUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regularUrl),
  }),
});

// Создание карточки
const reqRulesCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(regularUrl),
  }),
});

// Удаление карточки
const reqRulesDeleteCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

// Постановка лайка
const reqRulesSetLikeByCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

// Снятие лайка
const reqRulesRemoveLikeByCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  reqRulesLogin,
  reqRulesCreateUser,
  reqRulesGetUserById,
  reqRulesUpdateProfile,
  reqRulesUpdateAvatar,
  reqRulesCreateCard,
  reqRulesDeleteCardById,
  reqRulesSetLikeByCardId,
  reqRulesRemoveLikeByCardId,
};
