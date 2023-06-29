const CardModel = require('../models/card');

const getCards = (req, res) => {
  return CardModel.find({})
    .then((cards) => {
      return res.status(302).send(cards)
    })
    .catch((err) => {
      return res.status(500).send({'message': 'Сервер не отвечает'})
    })
};

const createCard = (req, res) => {
  const newCard = req.body;

  return CardModel.create(newCard)
    .then((card) => {
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({'message': `Переданы некорректные данные при создании карточки`})
      }
      return res.status(500).send({'message': 'Сервер не отвечает'})
    })
}

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({'message': `Карточка с указанным ${cardId} не найден`});
      }
      return res.status(200).send(`Карточка ${card} удалена`)
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(400).send({'message': `Некорректный ${cardId}`})
      }
      return res.status(500).send({'message': 'Сервер не отвечает'})
    })
};

const setLikeByCardId = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { returnDocument: 'after' })
    .then((card) => {
      if (!card) {
        return res.status(404).send({'message': `Передан несуществующий ${cardId} карточки`});
      }
      return res.status(200).send(card)
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(400).send({'message': 'Переданы некорректные данные для постановки лайка.'})
      }
      return res.status(500).send({'message': 'Сервер не отвечает'})
    })
}

const removeLikeByCardId = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { returnDocument: 'after' })
  .then((card) => {
    if (!card) {
      return res.status(404).send({'message': `Передан несуществующий ${cardId} карточки`});
    }
    return res.status(200).send(card)
  })
  .catch((err) => {
    if (err.kind === "ObjectId") {
      return res.status(400).send({'message': 'Переданы некорректные данные для снятия лайка.'})
    }
    return res.status(500).send({'message': 'Сервер не отвечает'})
  })
}

module.exports = { getCards, createCard, deleteCardById, setLikeByCardId, removeLikeByCardId };
