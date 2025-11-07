const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:server");
const cors = require("cors");
const { errors } = require("celebrate");
require("dotenv").config();

// Import routers & controllers
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

// Import config
const { PORT, MONGO_URI } = require("./utils/config");

const app = express();

// ---------- Middleware ---------- //
app.use(cors());
app.use(express.json());

// Request logging
app.use(requestLogger);

// ---------- Crash Test Route (for testing PM2 recovery) ---------- //
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// mount main router (some routes inside it might be public)
app.use("/", mainRouter);

// ---------- MongoDB Connection ---------- //
mongoose
  .connect(MONGO_URI)
  .then(() => {
    debug("Connected to MongoDB");
  })
  .catch((err) => {
    debug("MongoDB connection error:", err);
    process.exit(1); // Exit if database connection fails
  });

// ---------- Error Handling Middleware ---------- //
// error logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// centralized error handler
app.use(errorHandler);

// ---------- Start Server ---------- //
const server = app.listen(PORT, "0.0.0.0", () => {
  debug(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  debug("Server error:", err);
  if (err.code === "EADDRINUSE") {
    debug(`Port ${PORT} is already in use`);
  }
});

module.exports = app;
