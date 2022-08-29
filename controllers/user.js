/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
const bcrypt = require('bcrypt');

const User = require('../models/User');

const updateUser = async (req, res) => {
  // Checking if the user is trying to change anyother user
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      user.updatedAt = new Date();
      user.save();
      res.status(200).json('Account has been updated');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can update only your account!');
  }
};

const deleteUser = async (req, res) => {
  // Check if the user is deleting its own account
  console.log(req.body.userId, req.params.id);
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can delete only your account!');
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // Returns all user objects other than password and updatedAt
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};
const followUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    !user && res.status(404).json('User doesnot exists');

    const Currentuser = await User.findById(req.params.id);

    if (!Currentuser.following.includes(req.body.userId)) {
      await Currentuser.updateOne({ $push: { following: req.body.userId } });
      await user.updateOne({ $push: { followers: req.params.id } });
      res.status(200).json('User followed');
    } else {
      res.status(403).json('You already follow this user');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const unFollowUser = async (req, res) => {
  req.body = {
    unfollowUserId: '62ee5bb8bdca91abea0b38a8',
  };
  try {
    const unfollowUser = await User.findById(req.body.unfollowUserId);
    !unfollowUser && res.status(404).json('User doesnot exists');

    const user = await User.findById(req.params.id);

    if (!user.following.includes(req.body.unfollowUser)) {
      await user.updateOne({ $pull: { following: req.body.unfollowUserId } });
      await unfollowUser.updateOne({ $pull: { followers: req.params.id } });
      res.status(200).json('User unfollowed');
    } else {
      res.status(403).json("You don't follow this user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  updateUser, deleteUser, getUser, followUser, unFollowUser,
};
