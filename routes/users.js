const router = require('express').Router();
const requireAuth = require('../middleware/authMiddleware');
const isModerator = require('../middleware/isModerator');

const {
  updateUser, deleteUser, getUser, followUser, unFollowUser, postModeration,
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

// Post Moderation feed
router.get('/:id/postModeration/feed', requireAuth, isModerator, postModeration);

module.exports = router;
