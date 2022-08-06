
const User = require("../models/User");
const bcrypt = require("bcrypt");

// User Signup
const signup = async (req, res)=>{
    req.body = {
        "username": "faizan",
        "fullname": "FaizanQazi",
        "email": "faizn@gmail.com",
        "password": "123124243"
    }
    try {
            // Checking if the user already exist with email or username
            await User.findOne({email: req.body.email}) && res.status(500).json("User with this email already exists");

            await User.findOne({username: req.body.username}) && res.status(500).json("Username  not available");


            //generate new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
            })
            await newUser.save()
            res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json(error)
    }
}

// User Login
const login = async (req, res)=>{
    req.body = {
        "email": "danial@gmail.com",
        "password": "12314243"
    }
    try {
        // Checking if the user already exists
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");
    
        // Validating password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")
    
        res.status(200).json(user)
      } catch (err) {
        res.status(500).json(err)
      }
}

module.exports = {signup, login}

