const CardModel = require('../models/card');

const BadRequestError = require('../errors/BadRequestError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404

const getCards = (req, res, next) => (
  CardModel.find({})
    .then((cards) => (
      res.status(200).send(cards)
    ))
    .catch((err) => next(err))
);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { id } = req.user;
  if (!name || !link) throw new BadRequestError('Не передан name или link');
  return CardModel.create({ name, link, owner: id })
    .then((card) => (
      res.status(201).send(card)
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      if (err.name === 'ValidatorError') return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { id } = req.user;
  return CardModel.findById(cardId).orFail()
    .then((card) => {
      if (card.owner.valueOf() !== id) throw new ForbiddenError('Вы не владелец этой карточки');
      return card.deleteOne().then(() => res.send(card));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return next(new NotFoundError('Карточка с указанным id не найдена'));
      if (err.name === 'CastError') return next(new BadRequestError('Передан некорректный id'));
      return next(err);
    });
};

const setLikeByCardId = (req, res, next) => {
  const { cardId } = req.params;
  const { id } = req.user;
  return CardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: id } }, { returnDocument: 'after' }).orFail()
    .then((card) => (
      res.status(200).send(card)
    ))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return next(new NotFoundError('Карточка с указанным id не найдена'));
      if (err.name === 'CastError') return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      return next(err);
    });
};

const removeLikeByCardId = (req, res, next) => {
  const { cardId } = req.params;
  const { id } = req.user;
  return CardModel.findByIdAndUpdate(cardId, { $pull: { likes: id } }, { returnDocument: 'after' }).orFail()
    .then((card) => (
      res.status(200).send(card)
    ))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return next(new NotFoundError('Карточка с указанным id не найдена'));
      if (err.name === 'CastError') return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      return next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCardById, setLikeByCardId, removeLikeByCardId,
};
