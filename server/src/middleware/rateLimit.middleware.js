const { rateLimit } = require("express-rate-limit");

// AI calls cost money — cap them per signed-in user (IP as fallback).
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 6,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  validate: { keyGeneratorIpFallback: false },
  message: {
    success: false,
    message: "Too many requests. Please wait a minute and try again.",
  },
});

module.exports = { aiLimiter };
