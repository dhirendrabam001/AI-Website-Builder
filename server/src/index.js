const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

// all require
const connectDB = require("./config/connection");
const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
const userRoutes = require("../src/routes/user.routes");

// apis
app.use("/api/user", userRoutes);
const port = process.env.PORT || 2000;

app.listen(port, async () => {
  console.log(`Server is running port number ${port}`);
  await connectDB();
});
