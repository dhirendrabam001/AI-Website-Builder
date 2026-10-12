const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

// all require
const connectDB = require("./config/connection");
const app = express();

// CORS configuration
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header, such as Postman
    // or server-to-server requests.
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked this origin: ${origin}`));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: true,

  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));

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
