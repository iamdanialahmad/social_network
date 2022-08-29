const mongoose = require("mongoose");

// Post Schema
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    reported: {
        type: String,
        default: ''
    }
  },
  { timestamps: true }
);

PostSchema.pre("save", function(next){
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model("Post", PostSchema);