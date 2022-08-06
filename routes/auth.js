const router = require("express").Router();
const {signup, login} = require("../controllers/auth")

// User SignUp
router.get("/signup",signup)

// User Login
router.get("/login",login)

module.exports = router
