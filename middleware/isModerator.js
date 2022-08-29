const User = require('../models/User');

const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.isModerator) next();
    else res.status(403).json('You are not a moderator');
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
};

module.exports = isModerator;
