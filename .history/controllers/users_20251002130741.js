const mongoose = require("mongoose");
const User = require("../models/user");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!isValidId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /users
const createUser = async (req, res) => {
  // guard against missing body (e.g. Content-Type not set in client)
  const body = req.body || {};
  const { name, avatar } = body;

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
    res.status(201).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getUsers, getUserById, createUser };
