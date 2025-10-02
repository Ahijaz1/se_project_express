const router = require("express").Router();

const clothingItem = require("./clothingItem");

const usersRouter = require("./users");

router.use("/users", usersRouter);

module.exports = router;
