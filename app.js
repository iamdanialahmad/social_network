/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-console */
/* eslint-disable global-require */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cors = require('cors');

dotenv.config();

// Initializaing BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use(cors());

// parse application/x-www-form-urlencoded

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3001;
const {
  userRoute, authRoute, postRoute, feedRoute,
} = require('./routes');
const invalidRouter = require('./routes/invalidRoute');

dotenv.config();
if (process.env.NODE_ENV === 'dev') {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      const server = app.listen(process.env.PORT);
      console.log(`Server listening on PORT ${process.env.PORT}`);
      const io = require('./socket').init(server);
      io.on('connection', () => {
        console.log('Client connected');
      });
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  MongoMemoryServer.create().then((mongoUri) => {
    const uri = mongoUri.getUri();
    mongoose.connect(uri)
      .then(() => {
        console.log('Mongo connected to test db');
        const server = app.listen(PORT);
        console.log('Server listening on PORT 3000');
        const io = require('./socket').init(server);
        io.on('connection', () => {
          console.log('Client connected');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
app.use('/api/auth', authRoute);
app.use('/api/feed', feedRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.all('/*', invalidRouter);

module.exports = app;
