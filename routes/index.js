const router = require('express').Router();
const userRoutes = require('./user');
const cardsRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);

module.exports = router;
