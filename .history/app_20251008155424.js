// app.js
const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:server");

// Import routers & controllers
const mainRouter = require("./routes/index");
const {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
} = require("./controllers/users");

// Import auth middleware
const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  debug(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- Public Routes ---------- //

// POST /signup → create a new user
app.post("/signup", createUser);

// POST /signin → login and get JWT
app.post("/signin", login);

// GET /items → public example route
app.get("/items", (req, res) => {
  res.json([
    { id: 1, name: "Item A" },
    { id: 2, name: "Item B" },
    { id: 3, name: "Item C" },
  ]);
});

// ---------- Protected Routes ---------- //

// Apply auth middleware to all routes below
app.use(auth);

// Example protected route: GET /users/me
app.get("/users/me", getCurrentUser);

// Mount other routers (protected if placed below auth)
app.use("/", mainRouter);

// ---------- MongoDB Connection ---------- //
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => debug("Connected to MongoDB"))
  .catch((err) => debug("MongoDB connection error:", err));

// ---------- Start Server ---------- //
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});

module.exports = app; // optional for testing
