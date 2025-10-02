const express = require("express");
const router = express.Router();
const {
  getUserByIds,
  getUserByIdById,
  createUser,
} = require("../controllers/users");

router.get("/", getUserByIds);
router.get("/:userId", getUserByIdById);
router.post("/", createUser);

module.exports = router;
