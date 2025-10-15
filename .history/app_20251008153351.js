const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:server");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

// Import controllers
const { createUser, login } = require("./controllers/users");

const app = express();

app.use(express.json());

// request logging
app.use((req, res, next) => {
  debug(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// example user ID middleware (for protected routes)
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

// signup and signin routes
app.post("/signup", createUser);
app.post("/signin", login);

// Apply auth middleware to all routes below
app.use(auth);

// mount main router (for other routes, e.g., /users/me)
app.use("/", mainRouter);

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => debug("Connected to MongoDB"))
  .catch((err) => debug("MongoDB connection error:", err));

app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});

module.exports = app; // optional: export app for testing
