const router = require('express').Router();
const userFeed = require('../controllers/feed');

router.get('/:id', userFeed);

module.exports = router;
