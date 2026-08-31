const express = require("express");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

// all require
const connectDB = require("./config/connection");
const app = express();

const port = process.env.PORT || 2000;

app.listen(port, async () => {
  console.log(`Server is running port number ${port}`);
  await connectDB();
});
