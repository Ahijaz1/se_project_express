const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/constants");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Generic server error message
const GENERIC_SERVER_ERROR = "An error has occurred on the server.";

// GET /users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// POST /signup
const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body || {};

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(BAD_REQUEST).json({
      message: "Request body is required (set Content-Type: application/json)",
    });
  }

  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30
  ) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Name must be 2–30 characters" });
  }

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email and password required" });
  }

  try {
    const newUser = await User.create({ name, avatar, email, password });

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
    };

    return res.status(201).json(userResponse);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: err.message });
    }

    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// POST /signin
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }
};

// GET /users/me
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(NOT_FOUND).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// PATCH /users/me
const updateCurrentUser = async (req, res) => {
  const { name, avatar } = req.body;

  if (!name && !avatar) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "At least one of name or avatar must be provided" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // user ID from auth middleware
      { name, avatar },
      {
        new: true, // return the updated document
        runValidators: true, // ensure schema validators are applied
      }
    ).select("-password"); // exclude password

    if (!updatedUser) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: err.message });
    }

    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// Add this to exports
module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
