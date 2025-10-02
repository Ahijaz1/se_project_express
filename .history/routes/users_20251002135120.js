const express = require("express");
const router = express.Router();
const { getUsers, getUserById, createUser } = require("../controllers/users");

// GET all users
router.get("/", getUsers);

// GET one user by id
router.get("/:id", getUserById);

// POST create user
router.post("/", createUser);

module.exports = router;
