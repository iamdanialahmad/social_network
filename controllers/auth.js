/* eslint-disable no-unused-expressions */
require('dotenv').config();
const bcrypt = require('bcrypt');

const User = require('../models/User');

// handle errors
const handleErrors = (err) => {
  const errors = { username: '', email: '', password: '' };
  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// User Signup
const signup = async (req, res) => {
  try {
    // Checking if the user already exist with email or username
    await User.findOne({ email: req.body.email }) && res.status(500).json('User with this email already exists');

    await User.findOne({ username: req.body.username }) && res.status(500).json('Username  not available');

    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(200).json(newUser);
  } catch (err) {
    const error = handleErrors(err);
    return res.status(500).json(error);
  }
};

// User Login
const login = async (req, res) => {
  try {
    // Checking if the user already exists
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json('user not found');

    // Validating password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    !validPassword && res.status(400).json('wrong password');

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { signup, login };
