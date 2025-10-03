const mongoose = require("mongoose");
const User = require("../models/user");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// POST /users
const createUser = async (req, res) => {
  const { name, avatar } = req.body || {};

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body is required (set Content-Type: application/json)",
    });
  }

  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30
  ) {
    return res.status(400).json({ message: "Name must be 2-30 characters" });
  }

  if (!avatar || typeof avatar !== "string") {
    return res.status(400).json({ message: "Avatar URL is required" });
  }

  try {
    const user = await User.create({ name, avatar });
    return res.status(201).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = { getUsers, getUserById, createUser };
