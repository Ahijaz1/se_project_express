// controllers/users.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET = "dev-secret" } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/constants");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Generic server error message
const GENERIC_SERVER_ERROR = "An error has occurred on the server.";

// --------------------- GET /users ---------------------
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: GENERIC_SERVER_ERROR });
  }
};

// --------------------- GET /users/:id ---------------------
const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id))
    return res.status(BAD_REQUEST).json({ message: "Invalid user ID" });

  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(NOT_FOUND).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: GENERIC_SERVER_ERROR });
  }
};

// --------------------- POST /signup ---------------------
const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body || {};

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).json({ message: "All fields are required" });
  }

  if (typeof name !== "string" || name.length < 2 || name.length > 30) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Name must be 2–30 characters" });
  }

  try {
    const newUser = await User.create({ name, avatar, email, password }); // pre-save hook hashes password
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Email already exists" });
    if (err.name === "ValidationError")
      return res.status(BAD_REQUEST).json({ message: err.message });
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: GENERIC_SERVER_ERROR });
  }
};

// --------------------- POST /signin ---------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email and password are required" });

  try {
    const user = await User.findUserByCredentials(email, password); // model handles password check
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token });
  } catch {
    res.status(401).json({ message: "Incorrect email or password" });
  }
};

// --------------------- GET /users/me ---------------------
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(NOT_FOUND).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: GENERIC_SERVER_ERROR });
  }
};

// --------------------- PATCH /users/me ---------------------
const updateCurrentUser = async (req, res) => {
  const { name, avatar } = req.body;

  if (!name && !avatar) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "At least one of name or avatar must be provided" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(NOT_FOUND).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(BAD_REQUEST).json({ message: err.message });
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: GENERIC_SERVER_ERROR });
  }
};

// --------------------- EXPORT ---------------------
module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
