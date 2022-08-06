
const router = require("express").Router();
const {updateUser, deleteUser, getUser, followUser, unFollowUser} = require("../controllers/user")

//update user
router.put("/:id",updateUser);

//delete user
router.delete("/:id",deleteUser);

//get a user
router.get("/:id",getUser);

// Follow user
router.get("/:id/follow",followUser);

// Unfollow User
router.put("/:id/unfollow",unFollowUser);

module.exports = router