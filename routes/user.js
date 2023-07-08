const router = require('express').Router();

const {
  reqRulesGetUserById, reqRulesUpdateProfile, reqRulesUpdateAvatar,
} = require('../utils/requestValidationRules');

const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/user');

// Получить всех пользователей
router.get('', getUsers);

// Получить авторизированного пользователя
router.get('/me', getUserInfo);

// Получение пользователя по id
router.get('/:userId', reqRulesGetUserById, getUserById);

// Обновление профиля
router.patch('/me', reqRulesUpdateProfile, updateProfile);

// Обновление аватара
router.patch('/me/avatar', reqRulesUpdateAvatar, updateAvatar);

module.exports = router;
