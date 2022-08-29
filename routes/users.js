const router = require('express').Router();
const requireAuth = require('../middleware/authorization');
const isModerator = require('../middleware/isModerator');

const {
  updateUser, deleteUser, getUser, followUser, unFollowUser, postModeration,
} = require('../controllers/user');

// update user
router.put('/', requireAuth, updateUser);

// delete user
router.delete('/', requireAuth, deleteUser);

// get a user
router.get('/', requireAuth, getUser);

// Follow user
router.put('/follow', requireAuth, followUser);

// Unfollow User
router.put('/unfollow', requireAuth, unFollowUser);

// Post Moderation feed
router.get('/postModeration/feed', requireAuth, isModerator, postModeration);

module.exports = router;
