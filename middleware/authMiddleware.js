/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(403).json(err);
      } else {
        req.user = user;
        if (req.user.userId === req.params.id) next();
        else res.status(402).json('User not logged in');
      }
    });
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
};

module.exports = isAuth;
