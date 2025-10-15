const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const validator = require("validator");

// ------------------------
// POST /signup
// ------------------------
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Basic validations
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new BadRequestError("Invalid email format");
    }
    if (password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters");
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ConflictError("Email already registered");

    // Create user (password will be hashed by the model pre-save hook)
    const user = await User.create({ name, avatar, email, password });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).send(userResponse);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data"));
    } else {
      next(err);
    }
  }
};

// ------------------------
// POST /signin
// ------------------------
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    // validate email format
    if (typeof email !== "string" || !validator.isEmail(email)) {
      throw new BadRequestError("Invalid email format");
    }

    // Custom method in User model to validate credentials
    const user = await User.findUserByCredentials(email, password);

    // Generate JWT
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Set token as an HttpOnly cookie (for clients that use cookies)
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send token as JSON response as well
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

// ------------------------
// GET current user
// ------------------------
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new NotFoundError("User not found");
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// ------------------------
// PATCH update user info
// ------------------------
module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) throw new NotFoundError("User not found");
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data"));
    } else {
      next(err);
    }
  }
};
