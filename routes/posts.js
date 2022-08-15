const router = require('express').Router();
const requireAuth = require('../middleware/authorization');
const {
  createPost, updatePost, deletePost, getPost,
} = require('../controllers/post');

// POST /
router.post('/', requireAuth, createPost);

// PUT /:postId
router.put('/:postId', requireAuth, updatePost);

// DELETE /:postId
router.delete('/:postId', requireAuth, deletePost);

// GET /:postId
router.get('/:postId', requireAuth, getPost);

module.exports = router;
