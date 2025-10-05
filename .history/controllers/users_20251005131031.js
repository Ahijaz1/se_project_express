const mongoose = require("mongoose");
const User = require("../models/user");
const { BadRequestError, NotFoundError } = require("../utils/errors");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const GENERIC_SERVER_ERROR = "An error has occurred on the server.";

// GET /users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: GENERIC_SERVER_ERROR });
  }
};

// GET /users/:id
const getUserById = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidId(id))
    return res.status(400).json({ message: "Invalid user ID" });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: GENERIC_SERVER_ERROR });
  }
};

// POST /users
const createUser = async (req, res, next) => {
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
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: GENERIC_SERVER_ERROR });
  }
};

module.exports = { getUsers, getUserById, createUser };
