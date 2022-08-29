/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// User Signup
const signup = async (req, res) => {
  try {
    // Checking if the user already exist with email or username
    if (await User.findOne({ email: req.body.email })) {
      return res.status(422).json('User with this email already exists');
    }

    if (await User.findOne({ username: req.body.username })) {
      return res.status(422).json('Username  not available');
    }

    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Creating new user
    const newUser = new User({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
    });

    // Saving user to database
    await newUser.save();
    return res.status(200).json({
      Message: 'User Created Succesfully',
      userId: newUser._id,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// User Login
const login = async (req, res) => {
  try {
    // Checking if the user already exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json('user not found');
    }
    // Validating password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json('wrong password');
    }

    // Creating jwt token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '24h' },
    );
    return res.status(200).json({ token, userId: user._id });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { signup, login };
