const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

const JWT_SECRET = 'unique-secret-key';

module.exports = (req, res, next) => {
  // Там токен
  const { authorization } = req.headers;
  if (!authorization) return next(new UnauthorizedError('Необходима авторизация'));
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
