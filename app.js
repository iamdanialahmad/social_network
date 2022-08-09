/* eslint-disable no-console */
/* eslint-disable import/extensions */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const errorController = require('./controllers/errors');

const PORT = process.env.PORT || 5003;
const { userRoute, authRoute, postRoute } = require('./routes.js');

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

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use(errorController.get404);
