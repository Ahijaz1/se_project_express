const express = require("express");
const router = require("express").Router();
const {
  getUserByIds,
  getUserById,
  createUser,
} = require("../controllers/users");

router.get("/", getUserByIds);
router.get("/:userId", getUserById);
router.post("/", createUser);

module.exports = router;
