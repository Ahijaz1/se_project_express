const express = require("express");
const { getCurrentUser, updateUserInfo } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

// Protected user routes (require auth)
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserInfo);

module.exports = router;
