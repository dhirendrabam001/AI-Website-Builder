const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  register,
  login,
  me,
  logout,
} = require("../controllers/user.controllers");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

module.exports = router;
