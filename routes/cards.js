const router = require('express').Router();

const {
  reqRulesCreateCard,
  reqRulesDeleteCardById,
  reqRulesSetLikeByCardId,
  reqRulesRemoveLikeByCardId,
} = require('../utils/requestValidationRules');

const {
  getCards,
  createCard,
  deleteCardById,
  setLikeByCardId,
  removeLikeByCardId,
} = require('../controllers/cards');

// Получение всех карточек
router.get('', getCards);

// Создание карточки
router.post('', reqRulesCreateCard, createCard);

// Удаление карточки по id
router.delete('/:cardId', reqRulesDeleteCardById, deleteCardById);

// Постановка лайка по id
router.put('/:cardId/likes', reqRulesSetLikeByCardId, setLikeByCardId);

// Снятие лайка по id
router.delete('/:cardId/likes', reqRulesRemoveLikeByCardId, removeLikeByCardId);

module.exports = router;
