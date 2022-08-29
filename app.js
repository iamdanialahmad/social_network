/* eslint-disable global-require */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

// Initializaing BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// parse application/x-www-form-urlencoded

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;
const {
  userRoute, authRoute, postRoute, feedRoute,
} = require('./routes');
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

app.use('/api/auth', authRoute);
app.use('/api/feed', feedRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.all('/*', invalidRouter);
