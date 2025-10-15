const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET = "dev-secret" } = require("../utils/config");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

// Helper to validate Mongo ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// --------------------- POST /signup ---------------------
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Validate required fields
    if (!name || !avatar || !email || !password) {
      throw new BadRequestError("All fields are required");
    }

    // Validate name length
    if (typeof name !== "string" || name.length < 2 || name.length > 30) {
      throw new BadRequestError("Name must be 2–30 characters");
    }

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    // Create new user
    const newUser = await User.create({ name, avatar, email, password });
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Invalid data provided when creating user"));
    } else {
      next(err);
    }
  }
};

// --------------------- POST /signin ---------------------
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Missing fields
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestError("Invalid email format");
    }

    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      throw new UnauthorizedError("Incorrect email or password");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid email or password format"));
    } else if (err.message.includes("Incorrect email or password")) {
      next(new UnauthorizedError("Incorrect email or password"));
    } else {
      next(err);
    }
  }
};

// --------------------- GET /users/me ---------------------
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!isValidId(userId)) {
      throw new BadRequestError("Invalid user ID");
    }

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
    if (!name && !avatar) {
      throw new BadRequestError(
        "At least one of name or avatar must be provided"
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) throw new NotFoundError("User not found");

    res.status(200).json(updatedUser);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Invalid data provided when updating user"));
    } else {
      next(err);
    }
  }
};

// --------------------- EXPORT ---------------------
module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
