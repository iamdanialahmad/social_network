const mongoose = require("mongoose");

// Post Schema
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

PostSchema.pre("updateOne", function(next){
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model("Post", PostSchema);