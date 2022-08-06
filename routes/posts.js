const router = require("express").Router();
const {createPost, updatePost, deletePost, getPost} = require('../controllers/post')
//create a post

router.get("/", createPost);
//update a post

router.put("/:id", updatePost);
//delete a post

router.delete("/:id", deletePost);

//get a post

router.get("/:id", getPost);


module.exports = router;