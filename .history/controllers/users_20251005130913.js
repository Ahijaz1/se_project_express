const mongoose = require("mongoose");
const User = require("../models/user");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/constants");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// GET /users/:id
const getUserById = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidId(id)) return next(new BadRequestError("Invalid user ID"));

  try {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// POST /users
const createUser = async (req, res, next) => {
  const { name, avatar } = req.body || {};

  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new BadRequestError(
        "Request body is required (set Content-Type: application/json)"
      )
    );
  }

  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30
  ) {
    return next(new BadRequestError("Name must be 2-30 characters"));
  }

  if (!avatar || typeof avatar !== "string") {
    return next(new BadRequestError("Avatar URL is required"));
  }

  try {
    const user = await User.create({ name, avatar });
    res.status(201).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    next(err);
  }
};

module.exports = { getUsers, getUserById, createUser };
