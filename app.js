const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5003
const {userRoute, authRoute, postRoute} = require("./routes.js");
dotenv.config();


mongoose.connect(process.env.MONGO_URL)
  .then(async ()=> {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
})
  .catch((err)=> console.log(err.message))

app.use("/api/auth",authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);


