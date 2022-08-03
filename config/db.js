const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();
db = mongoose.connect(
    process.env.MONGO_URL,
    () => {
      console.log("Connected to MongoDB");
    }
  );
  

module.exports = db