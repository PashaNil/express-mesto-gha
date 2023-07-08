const router = require('express').Router();
const { login, createUser } = require('../controllers/user');
const { reqRulesLogin, reqRulesCreateUser } = require('../utils/requestValidationRules');

// Авторизация
router.post('/signin', reqRulesLogin, login);

// Регистрация
router.post('/signup', reqRulesCreateUser, createUser);

module.exports = router;
