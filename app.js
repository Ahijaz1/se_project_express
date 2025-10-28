const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:server");
const cors = require("cors");

// Import routers & controllers
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");

// auth middleware is applied at router-level where needed

// Import config
const { PORT, MONGO_URI } = require("./utils/config");

const app = express();

// ---------- Middleware ---------- //
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  debug(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- Public Routes ---------- //
app.post("/signup", createUser);
app.post("/signin", login);

// mount main router (some routes inside it might be public)
app.use("/", mainRouter);

// ---------- MongoDB Connection ---------- //
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    debug("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    debug("MongoDB connection error:", err);
  });

// ---------- Error Handling Middleware ---------- //
app.use((err, req, res, _next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || "An error has occurred on the server.";
  res.status(status).json({ message });
});

// ---------- Start Server ---------- //
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  debug(`Server is running on port ${PORT}`);
});

module.exports = app;
