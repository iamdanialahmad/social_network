const router = require('express').Router();
const requireAuth = require('../middleware/authorization');
const isModerator = require('../middleware/isModerator');

const {
  updateUser, deleteUser, getUser, followUser, unFollowUser, postModeration, payment,
} = require('../controllers/user');

// PUT      Updates User
router.put('/', requireAuth, updateUser);

// DELETE    Delete User
router.delete('/', requireAuth, deleteUser);

// GET      Get User
router.get('/', requireAuth, getUser);

// PUT /follow    Follow a user
router.put('/follow', requireAuth, followUser);

// PUT /unfollow    Unfollow a user
router.put('/unfollow', requireAuth, unFollowUser);

// GET /postmoderation/feed    Feed for moderator
router.get('/postModeration/feed', requireAuth, isModerator, postModeration);

// POST /payment     Subscipting to access social feed
router.post('/payment', requireAuth, payment);
module.exports = router;
