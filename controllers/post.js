
const Post = require("../models/Post");
const User = require("../models/User")

const createPost = async (req, res) => {
    req.body = {
      userId : "62ee603ea8f10429d7f47875",
      desc: "Shariq Third Post"
    }
    try {
      const user = await User.findById(req.body.userId)
      const newPost = new Post(req.body);

      await newPost.save();
      await user.updateOne({$push: {posts: newPost._id}})
      res.status(201).json(newPost);
    } catch (err) {
      res.status(409).json(err);
    }
  }

const updatePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
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
      const user = await User.findById(req.body.userId)
      if (post.userId.toString() === user._id.toString()) {
        await user.updateOne({$pull: {posts: req.params.id}})
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
      if(post){
        const {updatedAt,reported, ...other } = post._doc;
        return res.status(200).json(other);
      }else{
        return res.status(403).json("Post does not exists")
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

module.exports = {createPost,updatePost,deletePost,getPost}