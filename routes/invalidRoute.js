/* eslint-disable camelcase */
const invalidRouter = require('express').Router();
const { invalid_route } = require('../controllers/invalidRoute');

// Routing requests to its corresponding controllers
invalidRouter.all('/*', invalid_route);

// Exporting the module
module.exports = invalidRouter;
