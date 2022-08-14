const router = require('express').Router();
const userFeed = require('../controllers/feed');
const requireAuth = require('../middleware/authorization');

router.get('/', requireAuth, userFeed);

module.exports = router;
