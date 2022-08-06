const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    fullname: {
        type: String,
        min: 3,
        max: 20,
        unique: true,
      },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
    isModerator: {
      type: Boolean,
      default: false,
    },
    createdAt : {
        type: Date,
        immutable: true,
        default: ()=> Date.now()
    },
    updatedAt : {
        type: Date,
        default: ()=> Date.now()
    }
  }
);

UserSchema.pre("save", function(next){
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model("User", UserSchema);