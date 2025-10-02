const express = require("express");
const router = express.Router();
const {
  getUserByIds,
  getUserByIdById,
  createUser,
} = require("../controllers/users");

// GET all users
router.get("/", getUserByIds);

// GET one user by id
router.get("/:id", getUserByIdById);

// POST create user
router.post("/", createUser);

module.exports = router;
