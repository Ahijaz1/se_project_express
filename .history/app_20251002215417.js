const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:server");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());

// request logging (using debug instead of console)
app.use((req, res, next) => {
  debug(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// mount main router
app.use("/", mainRouter);

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => debug("Connected to MongoDB"))
  .catch((err) => debug("MongoDB connection error:", err));

app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});
