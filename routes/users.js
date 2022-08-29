const router = require('express').Router();
const requireAuth = require('../middleware/authMiddleware');
const {
  updateUser, deleteUser, getUser, followUser, unFollowUser,
} = require('../controllers/user');

// update user
router.put('/:id', requireAuth, updateUser);

// delete user
router.delete('/:id', requireAuth, deleteUser);

// get a user
router.get('/:id', requireAuth, getUser);

// Follow user
router.put('/:id/follow', requireAuth, followUser);

// Unfollow User
router.put('/:id/unfollow', requireAuth, unFollowUser);

module.exports = router;
