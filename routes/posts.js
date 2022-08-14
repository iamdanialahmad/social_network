const router = require('express').Router();
const requireAuth = require('../middleware/authorization');
const {
  createPost, updatePost, deletePost, getPost,
} = require('../controllers/post');
// create a post

router.post('/', requireAuth, createPost);
// update a post

router.put('/:postId', requireAuth, updatePost);
// delete a post

router.delete('/:postId', requireAuth, deletePost);

// get a post

router.get('/:postId', requireAuth, getPost);

module.exports = router;
