/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        res.status(403).json({ Error: error, Message: 'Access Forbidden' });
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
};

module.exports = isAuth;
