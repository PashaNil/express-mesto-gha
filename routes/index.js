const router = require('express').Router();
const userRoutes = require('./user');
const cardsRoutes = require('./cards');

router.use('/*', (req, res) => {
  res.status(404).send({'message': 'Несуществующая страница'})
})

router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);

module.exports = router;
