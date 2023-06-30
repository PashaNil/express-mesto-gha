const CardModel = require('../models/card');

const getCards = (req, res) => (
  CardModel.find({})
    .then((cards) => (
      res.status(200).send(cards)
    ))
    .catch(() => (
      res.status(500).send({ message: 'Сервер не отвечает' })
    ))
);

const createCard = (req, res) => {
  const newCard = req.body;

  return CardModel.create(newCard)
    .then((card) => (
      res.status(201).send(card)
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Сервер не отвечает' });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndDelete(cardId).orFail()
    .then((card) => (
      res.status(200).send(card)
    ))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: `Карточка с указанным ${cardId} не найден` });
      }
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: `Некорректный ${cardId}` });
      }
      return res.status(500).send({ message: 'Сервер не отвечает' });
    });
};

const setLikeByCardId = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { returnDocument: 'after' }).orFail()
    .then((card) => (
      res.status(200).send(card)
    ))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: `Передан несуществующий ${cardId} карточки` });
      }
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(500).send({ message: 'Сервер не отвечает' });
    });
};

const removeLikeByCardId = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { returnDocument: 'after' }).orFail()
    .then((card) => (
      res.status(200).send(card)
    ))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: `Передан несуществующий ${cardId} карточки` });
      }
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(500).send({ message: 'Сервер не отвечает' });
    });
};

module.exports = {
  getCards, createCard, deleteCardById, setLikeByCardId, removeLikeByCardId,
};
