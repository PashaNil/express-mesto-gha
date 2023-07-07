const router = require('express').Router();
const userRoutes = require('./user');
const cardsRoutes = require('./cards');
const authRoutes = require('./auth');
const authMiddlewares = require('../middlewares/auth');

router.use('', authRoutes);
router.use('/users', authMiddlewares, userRoutes);
router.use('/cards', authMiddlewares, cardsRoutes);
router.use('/*', (req, res) => {
  res.status(404).send({ message: 'Несуществующая страница' });
});

module.exports = router;
