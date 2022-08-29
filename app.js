/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;
const {
  userRoute, authRoute, postRoute, feedRoute,
} = require('./routes.js');
const invalidRouter = require('./routes/invalidRoute');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    const io = require('./socket')(server);
    io.on('Connection', () => {
      console.log('Client Connected Socket ');
    });
  })
  .catch((err) => console.log(err.message));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/feed', feedRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.all('/*', invalidRouter);
