const express = require("express");
const itemsRouter = require("./items");
const usersRouter = require("./users"); // only if you have user endpoints

const router = express.Router();

router.use("/items", itemsRouter);
router.use("/users", usersRouter); // optional, if users endpoints exist

module.exports = router;
