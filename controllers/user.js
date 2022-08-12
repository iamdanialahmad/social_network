/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Post = require('../models/Post');

module.exports.updateUser = async (req, res) => {
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

module.exports.deleteUser = async (req, res) => {
  // Check if the user is deleting its own account
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json('Account has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can delete only your account!');
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // Returns all user objects other than password and updatedAt
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
};
module.exports.followUser = async (req, res) => {
  try {
    // executing query to check if the
    const user = await User.findById(req.body.userId);
    if (!user) {
      res.status(404).json('User doesnot exists');
    } else {
      const Currentuser = await User.findById(req.params.id);

      if (!Currentuser.following.includes(req.body.userId)) {
        await Currentuser.updateOne({ $push: { following: req.body.userId } });
        await user.updateOne({ $push: { followers: req.params.id } });
        res.status(200).json('User followed');
      } else res.status(403).json('You already follow this user');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports.unFollowUser = async (req, res) => {
  try {
    const unfollowUser = await User.findById(req.body.unfollowUserId);
    if (!unfollowUser) {
      return res.status(404).json('User doesnot exists');
    }
    const user = await User.findById(req.params.id);

    if (!user.following.includes(req.body.unfollowUser)) {
      await user.updateOne({ $pull: { following: req.body.unfollowUserId } });
      await unfollowUser.updateOne({ $pull: { followers: req.params.id } });
      return res.status(200).json('User unfollowed');
    }
    return res.status(403).json("You don't follow this user");
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports.postModeration = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const { page = 1, limit = 6 } = req.query;
    // get total documents in the Posts collection
    const totalItems = await Post.find({}).countDocuments();

    // execute query with page and limit values
    const posts = await Post.find({})
      .limit(limit * 1)
      .skip((page - 1) * page)
      .sort({ createdAt: -1 })
      .select('-userId -likes -reported -updatedAt -__v')
      .exec();
    // return response with posts, total pages, and current page
    res.status(200).json({
      posts,
      totalPages: Math.ceil((totalItems / limit)),
      CurrentPage: page,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
