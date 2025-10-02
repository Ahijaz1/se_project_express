const router = require("express").Router();
const {
  getUserByIds,
  getUserById,
  createUser,
} = require("../controllers/users");

// GET /users
router.get("/", getUserByIds);

// GET user by ID
router.get("/:userId", getUserById);

// POST /users
router.post("/", createUser);

module.exports = router;
