const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { aiLimiter } = require("../middleware/rateLimit.middleware");
const {
  generate,
  chat,
  saveFiles,
  revert,
  list,
  get,
  remove,
} = require("../controllers/project.controllers");

const router = express.Router();

router.use(authMiddleware);

router.get("/", list);
router.post("/generate", aiLimiter, generate);
router.get("/:id", get);
router.post("/:id/chat", aiLimiter, chat);
router.put("/:id/files", saveFiles);
router.post("/:id/revert", revert);
router.delete("/:id", remove);

module.exports = router;
