const JWT_SECRET = 'unique-secret-key';

const SALT_ROUNDS = 10;

const { PORT = 3000 } = process.env;

module.exports = {
  JWT_SECRET,
  SALT_ROUNDS,
  PORT,
};
