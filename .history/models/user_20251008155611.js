const mongoose = require("mongoose");
const User = require("../models/user");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../utils/constants");

// Helper
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const GENERIC_SERVER_ERROR = "An error has occurred on the server.";

// GET /users/me
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(NOT_FOUND).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: GENERIC_SERVER_ERROR });
  }
};

// POST /signup
const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !email || !password || !avatar) {
    return res.status(BAD_REQUEST).json({ message: "All fields are required" });
  }

  try {
    const newUser = await User.create({ name, avatar, email, password });

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
    };

    res.status(201).json(userResponse);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Email already exists" });
    if (err.name === "ValidationError")
      return res.status(BAD_REQUEST).json({ message: err.message });
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: GENERIC_SERVER_ERROR });
  }
};

// POST /signin
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email and password required" });

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: "Incorrect email or password" });
  }
};

// PATCH /users/me
const updateUser = async (req, res) => {
  const { name, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser)
      return res.status(NOT_FOUND).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(BAD_REQUEST).json({ message: err.message });
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: GENERIC_SERVER_ERROR });
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
