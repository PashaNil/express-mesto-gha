const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { regularUrl } = require('../utils/regularExpressions');
const {
  getCards, createCard, deleteCardById, setLikeByCardId, removeLikeByCardId,
} = require('../controllers/cards');

// Получение всех карточек
router.get('', getCards);

// Создание карточки
router.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(regularUrl),
  }),
}), createCard);

// Удаление карточки по id
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).alphanum().required(),
  }),
}), deleteCardById);

// Постановка лайка по id
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).alphanum().required(),
  }),
}), setLikeByCardId);

// Снятие лайка по id
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).alphanum().required(),
  }),
}), removeLikeByCardId);

module.exports = router;
