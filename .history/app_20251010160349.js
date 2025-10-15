// app.js
const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:server");
const cors = require("cors");

// ---------- Import Routers & Controllers ---------- //
const mainRouter = require("./routes/index");
const {
  createUser,
  login,
  getCurrentUser,
  updateUserInfo,
} = require("./controllers/users");

// ---------- Import Auth Middleware ---------- //
const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;
const app = express();

// ---------- Middleware ---------- //

// Enable CORS (cross-origin requests)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Log every request (optional but useful for debugging)
app.use((req, res, next) => {
  debug(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- Public Routes ---------- //

// User signup
app.post("/signup", createUser);

// User signin (login)
app.post("/signin", login);

// ---------- Protected Routes ---------- //
// Everything below requires authentication
app.use(auth);

// Get the current logged-in user
app.get("/users/me", getCurrentUser);

// Update current user's profile info
app.patch("/users/me", updateUserInfo);

// Mount the main router (handles /items and other routes)
app.use("/", mainRouter);

// ---------- MongoDB Connection ---------- //
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => debug("Connected to MongoDB"))
  .catch((err) => debug("MongoDB connection error:", err));

// ---------- Error Handling Middleware ---------- //
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || "An error has occurred on the server.";
  res.status(status).json({ message });
});

// ---------- Start Server ---------- //
app.listen(PORT, () => {
  debug(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
