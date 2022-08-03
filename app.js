const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {userRoute, authRoute, postRoute} = require("./routes.js")
const db = require("./config/db")


// Middleware
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(5001, () => {
  console.log("Server is running!");
});
