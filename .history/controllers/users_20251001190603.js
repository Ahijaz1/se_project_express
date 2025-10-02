const User = require("../models/user");
const mongoose = require("mongoose");

// GET /users
const getUserByIds = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// GET /users/:userId
const getUserById = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) return res.status(404).send({ message: "User not found" });
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  // Validation
  if (!name || name.length < 2 || name.length > 30) {
    return res.status(400).send({ message: "Name must be 2-30 characters" });
  }

  if (!avatar) {
    return res.status(400).send({ message: "Avatar URL is required" });
  }

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports = { getUserByIds, getUserById, createUser };
