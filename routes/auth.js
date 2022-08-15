const router = require('express').Router();
const { signup, login } = require('../controllers/auth');

// POST /signup
router.post('/signup', signup);

// POST /login
router.post('/login', login);

module.exports = router;
