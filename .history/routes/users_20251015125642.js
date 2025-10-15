const express = require("express");
const { createUser, login } = require("../controllers/users");

const router = express.Router();

// POST login
router.post("/signin", login);

// POST signup
router.post("/signup", createUser);

module.exports = router;
