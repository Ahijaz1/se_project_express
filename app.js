const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:server");
const cors = require("cors");
const { errors } = require("celebrate");

// Import routers & controllers
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

// auth middleware is applied at router-level where needed

// Import config
const { PORT, MONGO_URI } = require("./utils/config");

const app = express();

// ---------- Middleware ---------- //
app.use(cors());
app.use(express.json());

// Request logging
app.use(requestLogger);

// ---------- Public Routes ---------- //
app.post("/signup", createUser);
app.post("/signin", login);

// mount main router (some routes inside it might be public)
app.use("/", mainRouter);

// ---------- MongoDB Connection ---------- //
mongoose
  .connect(MONGO_URI)
  .then(() => {
    debug("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    debug("MongoDB connection error:", err);
  });

// ---------- Error Handling Middleware ---------- //
// error logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

// ---------- Start Server ---------- //
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});

module.exports = app;
