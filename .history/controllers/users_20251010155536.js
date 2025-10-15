const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET = "dev-secret" } = require("../utils/config");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");

// Generic server error message
const GENERIC_SERVER_ERROR = "An error has occurred on the server.";

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// --------------------- GET /users ---------------------
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// --------------------- GET /users/:id ---------------------
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) throw new BadRequestError("Invalid user ID");

    const user = await User.findById(id).select("-password");
    if (!user) throw new NotFoundError("User not found");

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// --------------------- POST /signup ---------------------
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body || {};

    if (!name || !avatar || !email || !password) {
      throw new BadRequestError("All fields are required");
    }
    if (typeof name !== "string" || name.length < 2 || name.length > 30) {
      throw new BadRequestError("Name must be 2–30 characters");
    }

    const newUser = await User.create({ name, avatar, email, password });
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate email
      return next(new ConflictError("Email already exists"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    next(err);
  }
};

// --------------------- POST /signin ---------------------
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new BadRequestError("Email and password are required");

    const user = await User.findUserByCredentials(email, password); // model checks password
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token });
  } catch (err) {
    return next(new UnauthorizedError("Incorrect email or password"));
  }
};

// --------------------- GET /users/me ---------------------
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!isValidId(userId)) throw new BadRequestError("Invalid user ID");

    const user = await User.findById(userId).select("-password");
    if (!user) throw new NotFoundError("User not found");

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// --------------------- PATCH /users/me ---------------------
const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    if (!name && !avatar)
      throw new BadRequestError(
        "At least one of name or avatar must be provided"
      );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) throw new NotFoundError("User not found");
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    next(err);
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
