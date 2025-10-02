const router = require("express").Router();
const {
  getUserByIds,
  getUserById,
  createUser,
} = require("../controllers/users");

// GET all users
router.get("/", getUserByIds);

// GET user by ID
router.get("/:userId", getUserById);

// POST create user
router.post("/", createUser);

module.exports = router;
