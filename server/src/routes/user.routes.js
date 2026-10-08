const express = require("express");
const { register } = require("../controllers/user.controllers");

const router = express.Router();

router.post("/register", register);

module.exports = router;
