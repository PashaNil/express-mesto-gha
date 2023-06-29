const router = require('express').Router();
const userRoutes = require('./user');
const cardsRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);
router.use('/*', (req, res) => {
  res.status(404).send({ 'message': 'Несуществующая страница' })
})

module.exports = router;
