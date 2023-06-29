const router = require('express').Router();

const {
  getCards, createCard, deleteCardById, setLikeByCardId, removeLikeByCardId,
} = require('../controllers/cards');

router.get('', getCards);
router.post('', createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', setLikeByCardId);
router.delete('/:cardId/likes', removeLikeByCardId);

module.exports = router;
