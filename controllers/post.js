const { isObjectIdOrHexString } = require("mongoose");
const Post = require("../models/Post");

const createPost = async (req, res) => {
    const newPost = new Post(req.body);  
    try {
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      res.status(409).json(err);
    }
  }

const updatePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      console.log(post.userId,req.body.userId)
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        await post.save();
        res.status(200).json("The post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

const deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

const getPost =  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  }

module.exports = {createPost,updatePost,deletePost,getPost}