const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const debug = require("debug")("app:server");

const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const {
  createUser,
  login,
  getCurrentUser,
  updateUserInfo,
} = require("./controllers/users");

const { PORT = 3001 } = process.env;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  debug(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Public routes
app.post("/signup", createUser);
app.post("/signin", login);

// Protected routes
app.use(auth);
app.get("/users/me", getCurrentUser);
app.patch("/users/me", updateUserInfo);
app.use("/", mainRouter);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => debug("Connected to MongoDB"))
  .catch((err) => debug("MongoDB connection error:", err));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  res.status(status).json({ message });
});

app.listen(PORT, () => debug(`Server running on port ${PORT}`));
module.exports = app;
