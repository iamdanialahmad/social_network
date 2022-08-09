/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json(err);
    }
    req.user = user;
  });

  if (req.user.userId === req.params.id) next();
  else return res.status(402).json('User not logged in');
  next();
};
