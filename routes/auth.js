const router = require('express').Router();
const { signup, login } = require('../controllers/auth');

// User SignUp
router.post('/signup', signup);

// User Login
router.post('/login', login);

module.exports = router;
