const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:server");
const cors = require("cors");

// Import routers & controllers
const mainRouter = require("./routes/index");
const {
  createUser,
  login,
  getCurrentUser,
  updateUserInfo,
} = require("./controllers/users");

// Import auth middleware
const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;
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

// ---------- Protected Routes ---------- //
app.use(auth);
app.get("/users/me", getCurrentUser);
app.patch("/users/me", updateCurrentUser);
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
  debug(`Server is running on port ${PORT}`);
});

module.exports = app;
