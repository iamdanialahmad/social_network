
const User = require("../models/User");
const bcrypt = require("bcrypt");


const updateUser =  async (req, res) => {
    // Checking if the user is trying to change anyother user  
    if (req.body.userId === req.params.id) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
  
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        user.updatedAt = new Date();
        user.save()
        res.status(200).json("Account has been updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
}

const deleteUser = async (req, res) => {
    // Check if the user is deleting its own account
    if (req.body.userId === req.params.id) {
      try 
      {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } 
      catch (err) 
      {
        return res.status(500).json(err);
      }
    } 
    else 
    {
      return res.status(403).json("You can delete only your account!");
    }
  }

const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      // Returns all user objects other than password and updatedAt 
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  }

module.exports = {updateUser, deleteUser, getUser}