const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const { generateToken } = require('../utils/jwt');

const BadRequestError = require('../errors/BadRequestError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

const SALT_ROUNDS = 10;

// Авторизация с проверкой данных и отдачей токена
const login = (req, res, next) => {
  const { email, password } = req.body;
  // Проверка на наличие мыла и пароля
  if (!email || !password) throw new UnauthorizedError('Заполните email или password');
  // Поиск в бд пользователя с таким email
  return UserModel.findOne({ email }).select('+password').orFail()
    .then((user) => (
      // Получение пароля из хеша
      bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) return next(new ForbiddenError('Неправильный password'));
        // Cоздание и отдача токена
        const token = generateToken(user._id);
        return res.status(200).send({ token });
      })
    ))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return next(new UnauthorizedError('Такого пользователя не существует'));
      return next(err);
    });
};

// Получение информции о пользователе
const getUserInfo = (req, res, next) => {
  const { id } = req.user;
  UserModel.findById(id).orFail()
    .then((user) => (
      res.status(200).send(user)
    ))
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Переданы некорректные данные: id'));
      if (err.name === 'DocumentNotFoundError') return next(new NotFoundError('Пользователь по указанному id не найден'));
      return next(err);
    });
};

// Получение всех пользователей
const getUsers = (req, res, next) => (
  UserModel.find({}).orFail()
    .then((users) => (
      res.status(200).send(users)
    ))
    .catch((err) => next(err))
);

// Получение пользователя по id
const getUserById = (req, res, next) => {
  const { id } = req.params;
  return UserModel.findById(id).orFail()
    .then((user) => (
      res.status(200).send(user)
    ))
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Переданы некорректные данные, должен быть id'));
      if (err.name === 'DocumentNotFoundError') return next(new NotFoundError('Пользователь по указанному _id не найден'));
      return next(err);
    });
};

// Создание нового пользователя.
const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) throw new BadRequestError('Не передан email или password');

  return UserModel.findOne({ email })
    .then((user) => {
      if (user) throw new ConflictError('Такой пользователь уже существует');

      return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => (
        UserModel.create({ name, about, avatar, email, password: hash })
          .then(() => (
            res.status(201).send({ name, about, avatar, email })
          ))
          .catch((err) => {
            if (err.name === 'ValidationError') return next(new BadRequestError(err.message));
            return next(err);
          })
      ));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      return next(err);
    });
};

// Обновление информции профиля
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { id } = req.user;
  if (name || about) {
    return UserModel.findByIdAndUpdate(id, { name, about }, { returnDocument: 'after', runValidators: true }).orFail()
      .then((user) => (
        res.status(200).send(user)
      ))
      .catch((err) => {
        if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
        if (err.name === 'DocumentNotFoundError') return next(new NotFoundError('Пользователь с указанным _id не найден'));
        return next(err);
      });
  }
  return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
};

// Обновление аватара
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { id } = req.user;
  if (!avatar) {
    throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
  }
  return UserModel.findByIdAndUpdate(id, { avatar }, { returnDocument: 'after', runValidators: true }).orFail()
    .then((user) => (
      res.status(200).send(user)
    ))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return next(new NotFoundError('Пользователь с указанным id не найден'));
      if (err.name === 'ValidationError') return next(new BadRequestError(err.message));
      return next(err);
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar, login, getUserInfo,
};
