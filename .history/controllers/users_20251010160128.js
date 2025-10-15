const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");

// GET all users
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

// GET user by ID
module.exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");
    res.send(user);
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid user ID"));
    } else {
      next(err);
    }
  }
};

// POST /signup
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Validation: ensure valid email before proceeding
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new BadRequestError("Invalid email format");
    }

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ConflictError("Email already registered");

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });

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

// POST /signin
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res.send({ token });
  } catch (err) {
    next(err);
  }
};

// GET current user
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new NotFoundError("User not found");
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// PATCH update user info
module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) throw new NotFoundError("User not found");
    res.send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data"));
    } else {
      next(err);
    }
  }
};
