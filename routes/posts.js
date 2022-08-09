const router = require('express').Router();
const requireAuth = require('../middleware/authMiddleware');
const {
  createPost, updatePost, deletePost, getPost,
} = require('../controllers/post');
// create a post

router.post('/:id', requireAuth, createPost);
// update a post

router.put('/:id', requireAuth, updatePost);
// delete a post

router.delete('/:id', requireAuth, deletePost);

// get a post

router.get('/:id', requireAuth, getPost);

module.exports = router;
