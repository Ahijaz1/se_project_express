const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  login,
} = require("../controllers/users");

const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET one user by id
router.get("/:id", getUserById);

// POST create user
router.post("/", createUser);

module.exports = router;
