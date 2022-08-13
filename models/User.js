const mongoose = require('mongoose');
const { isEmail } = require('validator');

// User Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      min: 3,
      max: 20,
      unique: true,
    },
    fullname: {
      type: String,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: [true, 'Please enter a email'],
      max: 50,
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      min: [6, 'Minimum password length is 6 characters'],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    isModerator: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
);

UserSchema.pre(
  'save',
  function (next) {
    this.updatedAt = Date.now();
    next();
  },
);

module.exports = mongoose.model('User', UserSchema);
