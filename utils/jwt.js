const jwt = require('jsonwebtoken');

const JWT_SECRET = 'unique-secret-key';

// Функция создания токена
const generateToken = (id) => (
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' })
);

// Проверка токена
const verifyToken = (token, modelDb) => {
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return false;

    return modelDb.findById(decoded.id)
      .then((user) => (
        Boolean(user)
      ));
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
