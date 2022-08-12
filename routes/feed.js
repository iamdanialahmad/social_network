const router = require('express').Router();
const userFeed = require('../controllers/feed');
const requireAuth = require('../middleware/authMiddleware');

router.get('/:id', requireAuth, userFeed);

module.exports = router;
