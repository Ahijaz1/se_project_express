// controllers/users.js
const User = require("../models/user");

// GET /users
const getUserByIds = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// GET /users/:userId
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) return res.status(404).send({ message: "User not found" });
      res.send(user);
    })
    .catch((err)
    console.log(err);
    if (err.name === "DocumentNotFoundError") {
      else if (err.name === "CastError") {
    }
    return res.status(500).send({ message: err.message });
  })
    .catch((err)

    => res.status(500).send({ message: err.message }));
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = { getUserByIds, getUserById, createUser };
