/* eslint-disable no-underscore-dangle */

const io = require('../socket');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports.createPost = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const newPost = new Post(req.body);

    newPost.userId = req.userId;
    newPost.createrName = user.fullname;

    await user.updateOne({ $push: { posts: newPost._id.toString() } });
    await newPost.save();

    io.getIO().emit('posts', { action: 'create', post: newPost });

    return res.status(201).json({ message: 'Post succesfully created', postId: newPost._id });
  } catch (err) {
    return res.status(500).json(`Error: ${err}`);
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    await post.updateOne({ $set: req.body });
    res.status(200).json({ message: 'Post succesfully created', postId: post._id.toString() });
  } catch (err) {
    res.status(500).json(`Errors: ${err}`);
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const user = await User.findById(post.userId);
    await user.updateOne({ $pull: { posts: req.params.postId } });
    await post.deleteOne();

    return res.status(200).json('Post deleted successfully');
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
};

module.exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const { updatedAt, reported, ...other } = post._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(`Errors: ${err}`);
  }
};
