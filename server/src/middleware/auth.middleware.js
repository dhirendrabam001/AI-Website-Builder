const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log("token", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication.",
      });
    }
    console.error("Middleware", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = authMiddleware;
