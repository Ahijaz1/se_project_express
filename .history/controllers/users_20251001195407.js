const User = require("../models/user");

// GET /users - list all users
const getUserByIds = (req, res) => {
  User.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// GET /users/:userId - get a single user
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) return res.status(404).send({ message: "User not found" });
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID" });
      }
      res.status(500).send({ message: err.message });
    });
};

// POST /users - create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  // Validation
  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30
  ) {
    return res.status(400).send({ message: "Name must be 2-30 characters" });
  }

  if (!avatar || typeof avatar !== "string") {
    return res.status(400).send({ message: "Avatar URL is required" });
  }

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user)) // return full user with _id
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports = { getUserByIds, getUserById, createUser };
