const express = require("express");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`Server is running port number ${port}`);
});
