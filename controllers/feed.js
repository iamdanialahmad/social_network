const Post = require('../models/Post');
const User = require('../models/User');

const userFeed = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const { page = 1, limit = 2 } = req.query;
    const currUser = await User.findById(req.userId);

    // get total documents in the Posts collection
    const totalItems = await Post.find({ userId: { $in: currUser.following } }).countDocuments();

    // execute query with page and limit values
    const posts = await Post.find({ userId: { $in: currUser.following } })
      .limit(limit * 1)
      .skip((page - 1) * page)
      .sort({ createdAt: -1 })
      .select('-reported -updatedAt -__v')
      .exec();
      // return response with posts, total pages, and current page
    res.status(200).json({
      posts,
      totalPages: Math.ceil(totalItems / limit),
      CurrentPage: page,
    });
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
};
module.exports = userFeed;
