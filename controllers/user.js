const UserModel = require('../models/user');

const getUsers = (req, res) => (
  UserModel.find({})
    .then((users) => (
      res.status(200).send(users)
    ))
    .catch(() => res.status(500).send({ message: 'Сервер не отвечает' }))
);

const getUserById = (req, res) => {
  const { userId } = req.params;
  return UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь по указанному ${userId} не найден` });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: `Переданы некорректные данные: ${userId}` });
      }
      return res.status(500).send({ message: 'Сервер не отвечает' });
    });
};

const createUser = (req, res) => {
  const newUser = req.body;

  return UserModel.create(newUser)
    .then((user) => (
      res.status(200).send(user)
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'Сервер не отвечает' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  if (name || about) {
    return UserModel.findByIdAndUpdate(req.user._id, { name, about }, { returnDocument: 'after', runValidators: true })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: `Пользователь с указанным ${req.user._id} не найден` });
        }
        return res.status(200).send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        }
        return res.status(500).send({ message: 'Сервер не отвечает' });
      });
  }
  return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
  }
  return UserModel.findByIdAndUpdate(req.user._id, { avatar }, { returnDocument: 'after', runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      return res.status(404).send({ message: `Пользователь с указанным ${req.user._id} не найден` });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(500).send({ message: 'Сервер не отвечает' });
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
