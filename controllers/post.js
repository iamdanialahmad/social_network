/* eslint-disable no-underscore-dangle */
const Post = require('../models/Post');
const User = require('../models/User');

module.exports.createPost = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const newPost = new Post(req.body);

    await newPost.save();
    await user.updateOne({ $push: { posts: newPost._id } });
    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(409).json(err);
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      await post.save();
      return res.status(200).json('The post has been updated');
    }
    return res.status(403).json('you can update only your post');
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    if (post.userId.toString() === user._id.toString()) {
      await user.updateOne({ $pull: { posts: req.params.id } });
      await post.deleteOne();

      return res.status(200).json('the post has been deleted');
    }
    return res.status(403).json('you can delete only your post');
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      const { updatedAt, reported, ...other } = post._doc;
      return res.status(200).json(other);
    }
    return res.status(403).json('Post does not exists');
  } catch (err) {
    return res.status(500).json(err);
  }
};
