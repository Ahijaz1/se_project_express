const express = require("express");
const { getCurrentUser, updateUserInfo } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

const router = express.Router();

// Protected user routes (require auth)
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateUserInfo);

module.exports = router;
