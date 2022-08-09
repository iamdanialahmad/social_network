/* eslint-disable no-console */
/* eslint-disable import/extensions */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5003;
const { userRoute, authRoute, postRoute } = require('./routes.js');
const requireAuth = require('./middleware/authMiddleware');
const invalidRouter = require('./routes/invalidRoute');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log(err.message));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/users', requireAuth, userRoute);
app.use('/api/posts', requireAuth, postRoute);
app.all('/*', invalidRouter);
