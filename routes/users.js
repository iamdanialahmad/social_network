
const router = require("express").Router();
const {updateUser, deleteUser, getUser} = require("../controllers/user")

//update user
router.put("/:id",updateUser);

//delete user
router.delete("/:id",deleteUser);

//get a user
router.get("/:id",getUser);


module.exports = router