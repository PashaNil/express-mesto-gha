const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

// Функция создания токена
const generateToken = (id) => (
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' })
);

module.exports = {
  generateToken,
};
